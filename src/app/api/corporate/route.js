import { NextResponse } from 'next/server';
import { verifyAuth } from '../../lib/auth';
import { CorporateProfile } from '../../../lib/db';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// --- PUBLIC ROUTE ---
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    let count = await CorporateProfile.count();
    if (count === 0) {
      try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'corporate.json');
        if (fs.existsSync(filePath)) {
          const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          await CorporateProfile.create(data);
        }
      } catch (err) {
        console.error('Corporate auto-seed failed:', err);
      }
    }

    const profile = await CorporateProfile.findOne();
    return NextResponse.json(profile || {});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// --- PROTECTED ADMIN ROUTE ---
export async function PUT(req) {
  if (!verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
    }

    const body = await req.json();
    const { lastKnownUpdatedAt, ...data } = body;
    
    let profile = await CorporateProfile.findOne();
    
    if (profile) {
      // Concurrency check
      if (lastKnownUpdatedAt) {
        const dbTime = new Date(profile.updatedAt).getTime();
        const clientTime = new Date(lastKnownUpdatedAt).getTime();
        if (dbTime > clientTime) {
          return NextResponse.json({
            conflict: true,
            updatedBy: profile.updatedBy || 'unknown',
            updatedAt: profile.updatedAt,
          }, { status: 409 });
        }
      }
      profile = await profile.update({ ...data, updatedBy: decoded.username || 'unknown' });
    } else {
      profile = await CorporateProfile.create({ ...data, updatedBy: decoded.username || 'unknown' });
    }
    
    return NextResponse.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
