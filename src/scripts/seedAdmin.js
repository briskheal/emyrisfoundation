import { AdminUser, sequelize } from '../lib/db.js';
import bcrypt from 'bcrypt';

async function seedAdmin() {
  try {
    await sequelize.sync(); // ensure table exists
    const username = 'admin';
    const password = 'Password@123';
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Check if admin exists
    const existing = await AdminUser.findOne({ where: { username } });
    if (!existing) {
      await AdminUser.create({ username, passwordHash });
      console.log('Admin user created successfully.');
      console.log(`ID: ${username}`);
      console.log(`Password: ${password}`);
    } else {
      console.log('Admin user already exists.');
      // Optional: Update password if we want to reset it
      await existing.update({ passwordHash });
      console.log(`Password reset to: ${password}`);
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    process.exit(0);
  }
}

seedAdmin();
