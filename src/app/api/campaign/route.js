import { NextResponse } from 'next/server';
import { sendCampaignEmail } from '../../../lib/mailer';
import { CampaignRegistration } from '../../../lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    const { campaign, name, email, phone, details } = body;

    if (!campaign || !name) {
      return NextResponse.json({ error: 'Campaign and name are required.' }, { status: 400 });
    }

    // Save to Database
    await CampaignRegistration.create({
      campaign,
      name,
      email,
      phone,
      details
    });

    await sendCampaignEmail({ campaign, name, email, phone });

    return NextResponse.json({ success: true, message: 'Registration submitted successfully!' });
  } catch (error) {
    console.error('Campaign email error:', error);
    return NextResponse.json({ error: 'Failed to submit registration. Please try again.' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    jwt.verify(token, JWT_SECRET);
    const submissions = await CampaignRegistration.findAll({ order: [['createdAt', 'DESC']] });
    return NextResponse.json(submissions);
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized or error' }, { status: 401 });
  }
}

export async function DELETE(req) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    jwt.verify(token, JWT_SECRET);
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const submission = await CampaignRegistration.findByPk(id);
    if (submission) await submission.destroy();
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized or error' }, { status: 401 });
  }
}
