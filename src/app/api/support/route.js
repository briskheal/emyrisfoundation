import { NextResponse } from 'next/server';
import { sendSupportEmail } from '../../../lib/mailer';
import { rateLimit, verifyCaptcha } from '../../../lib/rate-limiter';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { isRateLimited } = rateLimit(req, 3);
    if (isRateLimited) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const { supportType, name, email, phone, message, captchaToken } = body;

    const isHuman = await verifyCaptcha(captchaToken);
    if (!isHuman) {
      return NextResponse.json({ error: 'Failed security verification. Please try again.' }, { status: 403 });
    }

    if (!supportType || !name || !email) {
      return NextResponse.json({ error: 'Support Type, Name, and Email are required.' }, { status: 400 });
    }

    await sendSupportEmail({ supportType, name, email, phone, message });

    return NextResponse.json({ success: true, message: 'Support details submitted successfully!' });
  } catch (error) {
    console.error('Support email error:', error);
    return NextResponse.json({ error: 'Failed to submit details. Please try again.' }, { status: 500 });
  }
}
