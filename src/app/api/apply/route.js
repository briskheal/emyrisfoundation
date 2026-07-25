import { NextResponse } from 'next/server';
import { sendCareerEmail } from '../../../lib/mailer';

export const dynamic = 'force-dynamic';

/**
 * Unified apply endpoint for: job, internship, volunteer
 * POST body must include: type, name, email, phone, and optionally position, details
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { type, name, email, phone, position, details } = body;

    if (!type || !name || !email) {
      return NextResponse.json({ error: 'Type, name and email are required.' }, { status: 400 });
    }

    const validTypes = ['job', 'internship', 'volunteer'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid application type.' }, { status: 400 });
    }

    await sendCareerEmail({ type, name, email, phone, position, details });

    return NextResponse.json({ success: true, message: 'Application submitted successfully!' });
  } catch (error) {
    console.error('Apply email error:', error);
    return NextResponse.json({ error: 'Failed to submit application. Please try again.' }, { status: 500 });
  }
}
