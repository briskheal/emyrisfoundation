import { NextResponse } from 'next/server';
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
  return POST(req); // Same logic for upserting content block
}
