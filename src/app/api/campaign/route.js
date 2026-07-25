import { NextResponse } from 'next/server';
import { sendCampaignEmail } from '../../../lib/mailer';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    const { campaign, name, email, phone } = body;

    if (!campaign || !name) {
      return NextResponse.json({ error: 'Campaign and name are required.' }, { status: 400 });
    }

    await sendCampaignEmail({ campaign, name, email, phone });

    return NextResponse.json({ success: true, message: 'Registration submitted successfully!' });
  } catch (error) {
    console.error('Campaign email error:', error);
    return NextResponse.json({ error: 'Failed to submit registration. Please try again.' }, { status: 500 });
  }
}
