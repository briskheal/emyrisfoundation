import { NextResponse } from 'next/server';
import { NewsActivity } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const news = await NewsActivity.findAll({ order: [['activityDate', 'DESC']] });
    return NextResponse.json(news);
  } catch (error) {
    console.error('Failed to fetch news activities:', error);
    return NextResponse.json({ error: 'Failed to fetch news activities' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const news = await NewsActivity.create(body);
    return NextResponse.json(news);
  } catch (error) {
    console.error('Failed to create news activity:', error);
    return NextResponse.json({ error: 'Failed to create news activity' }, { status: 500 });
  }
}
