import { NextResponse } from 'next/server';
import { sequelize, AdminUser } from '../../../lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // Ensure tables exist with latest schema (adds role column if missing)
    await sequelize.sync({ alter: true });

    // Hardcoded default credentials — always ensure both accounts exist
    const defaultAccounts = [
      { username: 'admin', password: 'Omrutam@1306', role: 'superadmin' },
      { username: 'junior', password: 'Junior@123', role: 'junior' },
    ];

    for (const acc of defaultAccounts) {
      const exists = await AdminUser.findOne({ where: { username: acc.username } });
      if (!exists) {
        const hash = await bcrypt.hash(acc.password, 10);
        await AdminUser.create({ username: acc.username, passwordHash: hash, role: acc.role });
      } else if (!exists.role) {
        // Fix existing rows that are missing the role column
        await exists.update({ role: acc.role });
      }
    }

    const admin = await AdminUser.findOne({ where: { username: username.toLowerCase() } });

    if (!admin) {
      return NextResponse.json({ error: `User not found: ${username}` }, { status: 401 });
    }

    const cleanPassword = (password || '').trim();

    // Check against bcrypt hash
    const isMatch = await bcrypt.compare(cleanPassword, admin.passwordHash);

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const role = admin.role || 'superadmin';
    const token = jwt.sign({ id: admin.id, username: admin.username, role }, JWT_SECRET, { expiresIn: '1d' });
    return NextResponse.json({ token, role, username: admin.username, message: 'Logged in successfully' });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error: ' + error.message }, { status: 500 });
  }
}
