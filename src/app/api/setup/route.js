import { NextResponse } from 'next/server';
import { sequelize, AdminUser, CorporateProfile } from '../../../lib/db';
import bcrypt from 'bcrypt';

export async function GET(req) {
  try {
    // 1. Force sync the database to ensure tables exist
    await sequelize.sync();

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

    return NextResponse.json({ 
      success: true, 
      message: 'Database synced and admin credentials reset to: username "admin", password "Password@123"' 
    });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
