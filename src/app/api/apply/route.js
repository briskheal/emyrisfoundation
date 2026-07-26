import { NextResponse } from 'next/server';
import { sendCareerEmail } from '../../../lib/mailer';
import { ApplicationSubmission } from '../../../lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type') || '';
    
    let type, position, name, email, phone, details, attachment;
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      type = formData.get('type');
      position = formData.get('position');
      name = formData.get('name');
      email = formData.get('email');
      phone = formData.get('phone');
      details = formData.get('details');
      
      const file = formData.get('resume');
      if (file && typeof file !== 'string' && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        attachment = {
          filename: file.name,
          content: buffer
        };
      }
    } else {
      const body = await req.json();
      ({ type, position, name, email, phone, details } = body);
    }

    if (!type || !name || !email) {
      return NextResponse.json({ error: 'Type, name, and email are required.' }, { status: 400 });
    }

    // Save to Database
    await ApplicationSubmission.create({
      type,
      position: position || null,
      name,
      email,
      phone,
      details
    });

    await sendCareerEmail({ type, name, email, phone, position, details, attachment });

    return NextResponse.json({ success: true, message: 'Application submitted successfully!' });
  } catch (error) {
    console.error('Apply email error:', error);
    return NextResponse.json({ error: 'Failed to submit application. Please try again.' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    jwt.verify(token, JWT_SECRET);
    const submissions = await ApplicationSubmission.findAll({ order: [['createdAt', 'DESC']] });
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
    const submission = await ApplicationSubmission.findByPk(id);
    if (submission) await submission.destroy();
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized or error' }, { status: 401 });
  }
}
