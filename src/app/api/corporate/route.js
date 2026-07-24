import { NextResponse } from 'next/server';
import { CorporateProfile } from '../../../lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// --- PUBLIC ROUTE ---
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const profile = await CorporateProfile.findOne();
    return NextResponse.json(profile || {});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// --- PROTECTED ADMIN ROUTE ---
export async function PUT(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
    }

    const body = await req.json();
    await CorporateProfile.sync({ alter: true });
    let profile = await CorporateProfile.findOne();
    
    if (profile) {
      profile = await profile.update(body);
    } else {
      profile = await CorporateProfile.create(body);
    }
    
    return NextResponse.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
