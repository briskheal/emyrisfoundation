import { NextResponse } from 'next/server';
import { Campaign } from '../../../lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGEME_JWT_SECRET';

const verifyAuth = (req) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  try {
    jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    return true;
  } catch (err) {
    return false;
  }
};

import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    let campaigns = await Campaign.findAll({ order: [['order', 'ASC']] });
    
    // Auto-seed if empty
    if (campaigns.length === 0) {
      const filePath = path.join(process.cwd(), 'src', 'data', 'campaigns.json');
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        await Campaign.bulkCreate(data.map((item, index) => ({ ...item, order: index })));
        campaigns = await Campaign.findAll({ order: [['order', 'ASC']] });
      }
    }
    
    return NextResponse.json(campaigns);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

export async function POST(req) {
  if (!verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const data = await req.json();
    if (!data.id) data.id = `camp-${Date.now()}`;
    const campaign = await Campaign.create(data);
    return NextResponse.json(campaign);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}

export async function PUT(req) {
  if (!verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const updatedBy = decoded.username || 'unknown';

    const body = await req.json();
    const { lastKnownUpdatedAt, ...data } = body;

    const item = await Campaign.findByPk(data.id);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Conflict detection: someone else saved after this user loaded the record
    if (lastKnownUpdatedAt) {
      const dbTime = new Date(item.updatedAt).getTime();
      const clientTime = new Date(lastKnownUpdatedAt).getTime();
      if (dbTime > clientTime) {
        return NextResponse.json({
          conflict: true,
          updatedBy: item.updatedBy || 'unknown',
          updatedAt: item.updatedAt,
        }, { status: 409 });
      }
    }

    await item.update({ ...data, updatedBy });
    return NextResponse.json({ message: 'Updated', item });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Unauthorized or error' }, { status: 401 });
  }
}

export async function DELETE(req) {
  if (!verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await Campaign.destroy({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 });
  }
}

