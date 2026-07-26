import { NextResponse } from 'next/server';
import { sendContactEmail } from '../../../lib/mailer';
import { ContactSubmission } from '../../../lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, subject, message } = body;

    if (!firstName || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 });
    }

    const fullName = `${firstName} ${lastName || ''}`.trim();
    
    // Save to Database
    await ContactSubmission.create({
      name: fullName,
      email,
      phone,
      message: `Subject: ${subject || 'No Subject'}\n\n${message}`
    });

    // Send Email
    await sendContactEmail({ firstName, lastName, email, phone, subject, message });

    return NextResponse.json({ success: true, message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    jwt.verify(token, JWT_SECRET);
    const submissions = await ContactSubmission.findAll({ order: [['createdAt', 'DESC']] });
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
    const submission = await ContactSubmission.findByPk(id);
    if (submission) await submission.destroy();
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized or error' }, { status: 401 });
  }
}
