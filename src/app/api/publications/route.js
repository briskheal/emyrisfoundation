import { NextResponse } from 'next/server';
import { Publication, sequelize } from '../../../lib/db';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    
    let count = await Publication.count();
    if (count === 0) {
      try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'publications.json');
        if (fs.existsSync(filePath)) {
          const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          const seedData = data.map((d, index) => ({
            id: d.id,
            title: d.title,
            year: d.year || '',
            pdfLink: d.pdfLink || '',
            order: index
          }));
          await Publication.bulkCreate(seedData);
        }
      } catch (err) {
        console.error('Publication auto-seed failed:', err);
      }
    }
    const items = await Publication.findAll({ order: [['order', 'ASC']] });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    jwt.verify(token, JWT_SECRET);
    const body = await req.json();
    const item = await Publication.create(body);
    return NextResponse.json({ message: 'Created', item });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized or error' }, { status: 401 });
  }
}

export async function PUT(req) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    jwt.verify(token, JWT_SECRET);
    const body = await req.json();
    const item = await Publication.findByPk(body.id);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    await item.update(body);
    return NextResponse.json({ message: 'Updated', item });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized or error' }, { status: 401 });
  }
}

export async function DELETE(req) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    jwt.verify(token, JWT_SECRET);
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const item = await Publication.findByPk(id);
    if (item) await item.destroy();
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized or error' }, { status: 401 });
  }
}
