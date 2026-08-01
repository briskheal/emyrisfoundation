import { NextResponse } from 'next/server';
import { CampaignDetail } from '../../../../lib/db';
import { getCampaignDetail } from '../../../../lib/data-fetcher';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    let detail = await CampaignDetail.findByPk(id);
    
    if (!detail) {
      detail = await getCampaignDetail(id);
      if (detail && detail.id) {
         return NextResponse.json(detail);
      }
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    return NextResponse.json(detail);
  } catch (error) {
    console.error('Error fetching campaign detail:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    let detail = await CampaignDetail.findByPk(id);
    
    if (!detail) {
      detail = await CampaignDetail.create({ id, ...body });
    } else {
      await detail.update(body);
    }
    
    return NextResponse.json(detail);
  } catch (error) {
    console.error('Error updating campaign detail:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
