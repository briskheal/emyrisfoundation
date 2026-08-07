import { NextResponse } from 'next/server';
import { ApplicationSubmission, ContactSubmission, CampaignRegistration } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await ApplicationSubmission.destroy({ where: {} });
    await ContactSubmission.destroy({ where: {} });
    await CampaignRegistration.destroy({ where: {} });
    return NextResponse.json({ success: true, message: 'All submissions deleted successfully to save memory.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
