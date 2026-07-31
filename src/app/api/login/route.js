import { NextResponse } from 'next/server';
import { sequelize, AdminUser } from '../../../lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGEME_JWT_SECRET';

export const dynamic = 'force-dynamic';

// Master credentials — always authoritative
const DEFAULT_CREDS = {
  admin:  { password: process.env.ADMIN_PASS || 'CHANGEME_ADMIN', role: 'superadmin' },
  junior: { password: process.env.JUNIOR_PASS || 'CHANGEME_JUNIOR', role: 'junior' },
};

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const lowerUser = (username || '').toLowerCase().trim();
    const cleanPass  = (password || '').trim();

    // Step 1: Ensure schema is up to date
    try {
      await sequelize.sync({ alter: true });
    } catch (syncErr) {
      console.error('Sync error (non-fatal):', syncErr.message);
    }

    // Step 2: For default accounts — ALWAYS sync the hash and role to match master creds
    if (DEFAULT_CREDS[lowerUser]) {
      const defaults = DEFAULT_CREDS[lowerUser];
      const freshHash = await bcrypt.hash(defaults.password, 10);
      try {
        const existing = await AdminUser.findOne({ where: { username: lowerUser } });
        if (!existing) {
          await AdminUser.create({ username: lowerUser, passwordHash: freshHash, role: defaults.role });
          console.log(`Created account: ${lowerUser}`);
        } else {
          // Always refresh the hash + role so it stays in sync with master creds
          await existing.update({ passwordHash: freshHash, role: defaults.role });
          console.log(`Refreshed credentials for: ${lowerUser}`);
        }
      } catch (err) {
        console.error(`Error syncing account ${lowerUser}:`, err.message);
      }
    }

    // Step 3: Find user
    const admin = await AdminUser.findOne({ where: { username: lowerUser } });
    if (!admin) {
      return NextResponse.json({ error: `User "${lowerUser}" not found.` }, { status: 401 });
    }

    // Step 4: Verify password against freshly updated hash
    const isMatch = await bcrypt.compare(cleanPass, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
    }

    // Step 5: Issue JWT
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
