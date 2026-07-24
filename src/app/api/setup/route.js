import { NextResponse } from 'next/server';
import { sequelize, AdminUser, CorporateProfile } from '../../../lib/db';
import bcrypt from 'bcrypt';

export async function GET(req) {
  try {
    // 1. Force sync the database to ensure tables exist and schema is updated
    await sequelize.sync({ alter: true });

    // 2. Upsert the admin user
    const defaultPassword = 'Password@123';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    
    const adminCount = await AdminUser.count({ where: { username: 'admin' }});
    if (adminCount === 0) {
      await AdminUser.create({ username: 'admin', passwordHash });
    } else {
      await AdminUser.update({ passwordHash }, { where: { username: 'admin' }});
    }

    // 3. Ensure a blank corporate profile exists if none
    const corpCount = await CorporateProfile.count();
    if (corpCount === 0) {
      await CorporateProfile.create({ name: 'Emyris Foundation' });
    }

    // 4. Seed Phase 1 Data
    const { HeroSlide, Campaign, WorkActivity } = require('../../../lib/db');
    const fs = require('fs');
    const path = require('path');

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

    return NextResponse.json({ 
      success: true, 
      message: 'Database synced and admin credentials reset to: username "admin", password "Password@123"' 
    });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
