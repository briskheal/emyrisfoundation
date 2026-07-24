import { NextResponse } from 'next/server';
import { AdminUser } from '../../../lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // First time setup check: if no admins exist, create the default admin
    const adminCount = await AdminUser.count();
    if (adminCount === 0) {
      const defaultPassword = 'Password@123';
      const passwordHash = await bcrypt.hash(defaultPassword, 10);
      await AdminUser.create({ username: 'admin', passwordHash });
    }

    const admin = await AdminUser.findOne({ where: { username } });
    
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '1d' });
    return NextResponse.json({ token, message: 'Logged in successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
