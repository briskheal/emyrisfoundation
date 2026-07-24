import { NextResponse } from 'next/server';
import { WorkActivity } from '../../../lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

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
    let works = await WorkActivity.findAll({ order: [['order', 'ASC']] });
    
    // Auto-seed if empty
    if (works.length === 0) {
      const filePath = path.join(process.cwd(), 'src', 'data', 'work.json');
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        await WorkActivity.bulkCreate(data.map((item, index) => ({ ...item, order: index })));
        works = await WorkActivity.findAll({ order: [['order', 'ASC']] });
      }
    }
    
    return NextResponse.json(works);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch work activities' }, { status: 500 });
  }
}

export async function POST(req) {
  if (!verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const data = await req.json();
    if (!data.id) data.id = `work-${Date.now()}`;
    const work = await WorkActivity.create(data);
    return NextResponse.json(work);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create work activity' }, { status: 500 });
  }
}

export async function PUT(req) {
  if (!verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const data = await req.json();
    const { id, ...updates } = data;
    await WorkActivity.update(updates, { where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update work activity' }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (!verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await WorkActivity.destroy({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete work activity' }, { status: 500 });
  }
}
