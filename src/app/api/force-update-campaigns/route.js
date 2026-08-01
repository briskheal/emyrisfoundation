import { NextResponse } from 'next/server';
import { CampaignDetail } from '../../../lib/db';
import { getCampaignDetail } from '../../../lib/data-fetcher';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const campaigns = ['blood', 'shiksha', 'organ', 'plantation', 'welfare'];
    const results = [];
    
    // First, sync the table to make sure schema is up to date
    await CampaignDetail.sync({ alter: true });

    for (const id of campaigns) {
      // getCampaignDetail will return the defaultData if it fails or if we bypass findByPk
      // Actually, we want the defaultData. The easiest way is to temporarily drop the table again,
      // and then call getCampaignDetail for each ID.
    }
    
    // Actually, let's just wipe it and insert
    await CampaignDetail.sync({ force: true });
    
    for (const id of campaigns) {
      // Since table is empty, getCampaignDetail will insert the defaultData and return it
      const detail = await getCampaignDetail(id);
      results.push(detail);
    }
    
    return NextResponse.json({ success: true, message: 'Force updated all campaigns from defaultData.', results });
  } catch (error) {
    console.error('Error forcing update:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
