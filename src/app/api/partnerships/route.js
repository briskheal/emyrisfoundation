import { NextResponse } from 'next/server';
import { Partnership } from '../../../lib/db';
import { verifyAuth } from '../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const parts = await Partnership.findAll({ order: [['order', 'ASC']] });
    return NextResponse.json(parts);
  } catch (error) {
    console.error('Error fetching partnerships:', error);
    return NextResponse.json({ error: 'Failed to fetch partnerships' }, { status: 500 });
  }
}

export async function POST(req) {
  if (!verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const data = await req.json();
    if (!data.id) {
      data.id = data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : `partnership-${Date.now()}`;
    }
    const part = await Partnership.create(data);
    return NextResponse.json(part);
  } catch (error) {
    console.error('Error creating partnership:', error);
    return NextResponse.json({ error: 'Failed to create partnership' }, { status: 500 });
  }
}
