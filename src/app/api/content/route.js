import { NextResponse } from 'next/server';
import { verifyAuth } from '../../../lib/auth';
import { SectionContent } from '../../../lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const content = await SectionContent.findAll();
    return NextResponse.json(content);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  if (!verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    jwt.verify(authHeader.split(' ')[1], JWT_SECRET);

    const body = await req.json();
    const existing = await SectionContent.findOne({ where: { id: body.id } });
    if (existing) {
      await existing.update(body);
      return NextResponse.json(existing);
    } else {
      const newContent = await SectionContent.create(body);
      return NextResponse.json(newContent);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
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

    const item = await SectionContent.findByPk(data.id);
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
