import { NextResponse } from 'next/server';
import { HeroSlide } from '../../../lib/db';
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
    let slides = await HeroSlide.findAll({ order: [['order', 'ASC']] });
    
    // Auto-seed if empty
    if (slides.length === 0) {
      const filePath = path.join(process.cwd(), 'src', 'data', 'heroSlides.json');
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        await HeroSlide.bulkCreate(data.map((item, index) => ({ ...item, order: index })));
        slides = await HeroSlide.findAll({ order: [['order', 'ASC']] });
      }
    }
    
    return NextResponse.json(slides);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch hero slides' }, { status: 500 });
  }
}

export async function POST(req) {
  if (!verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const data = await req.json();
    if (!data.id) data.id = `slide-${Date.now()}`;
    const slide = await HeroSlide.create(data);
    return NextResponse.json(slide);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create slide' }, { status: 500 });
  }
}

export async function PUT(req) {
  if (!verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const data = await req.json();
    const { id, ...updates } = data;
    await HeroSlide.update(updates, { where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update slide' }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (!verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await HeroSlide.destroy({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 });
  }
}
