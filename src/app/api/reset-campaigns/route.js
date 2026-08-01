import { NextResponse } from 'next/server';
import { CampaignDetail } from '../../../lib/db';

export async function GET() {
  try {
    await CampaignDetail.sync({ force: true });
    return NextResponse.json({ success: true, message: 'CampaignDetail table dropped and recreated successfully.' });
  } catch (error) {
    console.error('Error resetting DB:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
