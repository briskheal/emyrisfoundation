import { NextResponse } from 'next/server';
import { HeroStat } from '../../../lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await HeroStat.findAll({ order: [['order', 'ASC']] });
    return NextResponse.json(stats);
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
    const newStat = await HeroStat.create(body);
    return NextResponse.json(newStat);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    jwt.verify(authHeader.split(' ')[1], JWT_SECRET);

    const body = await req.json();
    await HeroStat.update(body, { where: { id: body.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    jwt.verify(authHeader.split(' ')[1], JWT_SECRET);

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    await HeroStat.destroy({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
