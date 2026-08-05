import { NextResponse } from 'next/server';
import { sequelize, AdminUser } from '../../../lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGEME_JWT_SECRET';
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error("FATAL ERROR: JWT_SECRET environment variable is not set in production.");
}

const rateLimit = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 mins
  const maxRequests = 10;

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  const record = rateLimit.get(ip);
  if (now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  record.count += 1;
  if (record.count > maxRequests) {
    return true;
  }
  return false;
}

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

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many login attempts. Please try again in 15 minutes.' }, { status: 429 });
    }

    // Step 1: Ensure master accounts exist (only create if missing, avoid rehashing on every attempt)
    if (DEFAULT_CREDS[lowerUser]) {
      const defaults = DEFAULT_CREDS[lowerUser];
      const existing = await AdminUser.findOne({ where: { username: lowerUser } });
      
      if (!existing) {
        const freshHash = await bcrypt.hash(defaults.password, 10);
        await AdminUser.create({ username: lowerUser, passwordHash: freshHash, role: defaults.role });
        console.log(`Created default account: ${lowerUser}`);
      } else if (cleanPass === defaults.password) {
         // If they logged in with the exact ENV master password, ensure the hash and role in DB are in sync
         const freshHash = await bcrypt.hash(defaults.password, 10);
         await existing.update({ passwordHash: freshHash, role: defaults.role });
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
