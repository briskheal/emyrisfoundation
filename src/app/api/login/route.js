import { NextResponse } from 'next/server';
import { sequelize, AdminUser } from '../../../lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const dynamic = 'force-dynamic';

// Default credentials map — checked on every login
const DEFAULT_CREDS = {
  admin:  { password: 'Omrutam@1306', role: 'superadmin' },
  junior: { password: 'Junior@123',   role: 'junior' },
};

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const lowerUser = (username || '').toLowerCase().trim();
    const cleanPass  = (password || '').trim();

    // Step 1: Ensure schema is up to date (adds role column safely)
    try {
      await sequelize.sync({ alter: true });
    } catch (syncErr) {
      console.error('Sync error (non-fatal):', syncErr.message);
    }

    // Step 2: If this is a known default account, ensure it exists with correct hash
    if (DEFAULT_CREDS[lowerUser]) {
      const defaults = DEFAULT_CREDS[lowerUser];
      const hash = await bcrypt.hash(defaults.password, 10);
      try {
        const existing = await AdminUser.findOne({ where: { username: lowerUser } });
        if (!existing) {
          await AdminUser.create({ username: lowerUser, passwordHash: hash, role: defaults.role });
          console.log(`Created default account: ${lowerUser}`);
        } else {
          // Patch missing role on existing row
          if (!existing.role) {
            await existing.update({ role: defaults.role });
          }
        }
      } catch (createErr) {
        console.error(`Error ensuring account ${lowerUser}:`, createErr.message);
      }
    }

    // Step 3: Find the user
    const admin = await AdminUser.findOne({ where: { username: lowerUser } });
    if (!admin) {
      return NextResponse.json({ error: `User "${lowerUser}" not found. Please contact administrator.` }, { status: 401 });
    }

    // Step 4: Verify password
    const isMatch = await bcrypt.compare(cleanPass, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
    }

    // Step 5: Issue JWT with role
    const role = admin.role || 'superadmin';
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return NextResponse.json({ token, role, username: admin.username, message: 'Logged in successfully' });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error: ' + error.message }, { status: 500 });
  }
}
