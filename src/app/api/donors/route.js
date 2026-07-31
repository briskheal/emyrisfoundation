import { NextResponse } from 'next/server';
import { Donor } from '../../../lib/db';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGEME_JWT_SECRET';

function verifyToken(req) {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  const token = auth.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export async function GET() {
  try {
    const donors = await Donor.findAll({ order: [['order', 'ASC']] });
    return NextResponse.json(donors);
  } catch (error) {
    console.error('Error fetching donors:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const id = formData.get('id') || crypto.randomUUID();
    const name = formData.get('name');
    const order = parseInt(formData.get('order') || '0', 10);
    const file = formData.get('image');

    let imageUrl = ''; // Empty by default

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      try {
        await fs.access(uploadsDir);
      } catch {
        await fs.mkdir(uploadsDir, { recursive: true });
      }

      const filename = `donor_${Date.now()}_${Math.round(Math.random() * 1E9)}.webp`;
      const finalBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
      const filepath = path.join(uploadsDir, filename);
      await fs.writeFile(filepath, finalBuffer);
      
      imageUrl = `/api/media/${filename}`;
    }

    // Check if updating
    const existing = await Donor.findByPk(id);
    if (existing) {
      // If we didn't upload a new file but existing has one, keep it
      if (!file || file.size === 0) {
        imageUrl = existing.image || imageUrl;
      }
      await existing.update({ name, image: imageUrl, order });
      return NextResponse.json(existing);
    }

    const newDonor = await Donor.create({ id, name, image: imageUrl, order });
    return NextResponse.json(newDonor);
  } catch (error) {
    console.error('Error saving donor:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await Donor.destroy({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting donor:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
