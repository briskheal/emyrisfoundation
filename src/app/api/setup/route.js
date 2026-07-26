import { NextResponse } from 'next/server';
import { sequelize, AdminUser, CorporateProfile, HeroSlide, Campaign, WorkActivity, PresenceLocation, JobOpening } from '../../../lib/db';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Sync database schema — alter:true safely ADDS new columns without wiping data
    await sequelize.sync({ alter: true });

    // 2. Upsert superadmin
    const defaultPassword = 'Omrutam@1306';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    const adminCount = await AdminUser.count({ where: { username: 'admin' } });
    if (adminCount === 0) {
      await AdminUser.create({ username: 'admin', passwordHash, role: 'superadmin' });
    } else {
      await AdminUser.update({ passwordHash, role: 'superadmin' }, { where: { username: 'admin' } });
    }

    // 3. Create junior admin if not exists
    const juniorCount = await AdminUser.count({ where: { username: 'junior' } });
    if (juniorCount === 0) {
      const juniorHash = await bcrypt.hash('Junior@123', 10);
      await AdminUser.create({ username: 'junior', passwordHash: juniorHash, role: 'junior' });
    } else {
      await AdminUser.update({ role: 'junior' }, { where: { username: 'junior' } });
    }

    // 4. Ensure a blank corporate profile exists
    const corpCount = await CorporateProfile.count();
    if (corpCount === 0) {
      await CorporateProfile.create({ name: 'Emyris Foundation' });
    }

    // 5. Seed Phase 1 static data from JSON files
    const seedData = async (Model, fileName) => {
      const count = await Model.count();
      if (count === 0) {
        const filePath = path.join(process.cwd(), 'src', 'data', fileName);
        if (fs.existsSync(filePath)) {
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          await Model.bulkCreate(data.map((item, index) => ({ ...item, order: index })));
        }
      }
    };

    await seedData(HeroSlide, 'heroSlides.json');
    await seedData(Campaign, 'campaigns.json');
    await seedData(WorkActivity, 'work.json');
    await seedData(PresenceLocation, 'presence.json');
    
    // Custom seed logic for jobs to ensure descriptions are populated if missing
    const jobsPath = path.join(process.cwd(), 'src', 'data', 'jobs.json');
    if (fs.existsSync(jobsPath)) {
      const jobsData = JSON.parse(fs.readFileSync(jobsPath, 'utf8'));
      const jobsCount = await JobOpening.count();
      if (jobsCount === 0) {
        await JobOpening.bulkCreate(jobsData.map((item, index) => ({ ...item, order: index })));
      } else {
        // Recover missing descriptions due to schema update
        for (const item of jobsData) {
          await JobOpening.update({ desc: item.desc }, { where: { id: item.id, desc: null } });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database synced. Admin: admin/Omrutam@1306 | Junior: junior/Junior@123'
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
