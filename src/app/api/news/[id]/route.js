import { NextResponse } from 'next/server';
import { NewsActivity } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const news = await NewsActivity.findByPk(id);
    if (!news) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(news);
  } catch (error) {
    console.error('Failed to fetch news activity:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const news = await NewsActivity.findByPk(id);
    if (!news) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    await news.update(body);
    return NextResponse.json(news);
  } catch (error) {
    console.error('Failed to update news activity:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const news = await NewsActivity.findByPk(id);
    if (!news) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    await news.destroy();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete news activity:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
