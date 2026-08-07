import { NextResponse } from 'next/server';
import { GalleryMedia } from '../../../lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGEME_JWT_SECRET';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    let whereClause = {};
    if (type && type !== 'all') whereClause.type = type;
    if (year && year !== 'all') whereClause.year = year;
    if (month && month !== 'all') whereClause.month = month;

    const media = await GalleryMedia.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    
    return NextResponse.json(media);
  } catch (err) {
    console.error('Gallery GET Error:', err);
    return NextResponse.json({ error: 'Failed to fetch gallery media' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    jwt.verify(token, JWT_SECRET);

    const body = await req.json();
    const { type, title, url, year, month } = body;

    if (!type || !url || !year || !month) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newMedia = await GalleryMedia.create({
      type,
      title: title || '',
      url,
      year,
      month
    });

    return NextResponse.json({ success: true, media: newMedia });
  } catch (err) {
    console.error('Gallery POST Error:', err);
    return NextResponse.json({ error: 'Unauthorized or Error' }, { status: 401 });
  }
}

export async function DELETE(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    jwt.verify(token, JWT_SECRET);

    const id = new URL(req.url).searchParams.get('id');
    const media = await GalleryMedia.findByPk(id);
    if (media) {
      await media.destroy();
    }
    
    return NextResponse.json({ message: 'Deleted' });
  } catch (err) {
    return NextResponse.json({ error: 'Unauthorized or error' }, { status: 401 });
  }
}

