import { NextResponse } from 'next/server';
import { Partnership } from '../../../../lib/db';
import { verifyAuth } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const part = await Partnership.findByPk(id);
    if (!part) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(part);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  if (!verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    const data = await req.json();
    const part = await Partnership.findByPk(id);
    if (!part) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    await part.update(data);
    return NextResponse.json(part);
  } catch (error) {
    console.error('Error updating partnership:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    const part = await Partnership.findByPk(id);
    if (!part) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    await part.destroy();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting partnership:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
