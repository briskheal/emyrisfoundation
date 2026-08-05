import { NextResponse } from 'next/server';
import { verifyAuth } from '../../../../lib/auth';
import { WorkDetail } from '../../../../lib/db';
import { getWorkDetail } from '../../../../lib/data-fetcher';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    let detail = await WorkDetail.findByPk(id);
    
    if (!detail) {
      detail = await getWorkDetail(id);
      if (detail && detail.id) {
         return NextResponse.json(detail);
      }
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    return NextResponse.json(detail);
  } catch (error) {
    console.error('Error fetching work detail:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  if (!verifyAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    const body = await request.json();
    let detail = await WorkDetail.findByPk(id);
    if (!detail) {
      detail = await WorkDetail.create({ id, ...body });
    } else {
      await detail.update(body);
    }
    return NextResponse.json(detail);
  } catch (error) {
    console.error('Error updating work detail:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
