import { NextResponse } from 'next/server';
import { sendCampaignEmail } from '../../../lib/mailer';
import { CampaignRegistration } from '../../../lib/db';
import jwt from 'jsonwebtoken';
import { rateLimit, verifyCaptcha } from '../../../lib/rate-limiter';

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGEME_JWT_SECRET';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { isRateLimited } = rateLimit(req, 3);
    if (isRateLimited) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const { name, email, phone, campaign, details, botField, captchaToken } = body;

    if (botField) {
      return NextResponse.json({ success: true, message: 'Registration received successfully!' });
    }

    const isHuman = await verifyCaptcha(captchaToken);
    if (!isHuman) {
      return NextResponse.json({ error: 'Failed security verification. Please try again.' }, { status: 403 });
    }

    if (!name || !email || !campaign) {
      return NextResponse.json({ error: 'Campaign and name are required.' }, { status: 400 });
    }

    // Save to Database
    // Database save removed as per user request to save memory. Forwarding email only.

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
    return NextResponse.json({ error: error.message || 'Unknown Server Error' }, { status: 401 });
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
    return NextResponse.json({ error: error.message || 'Unknown Server Error' }, { status: 401 });
  }
}

