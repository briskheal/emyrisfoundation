import { NextResponse } from 'next/server';
import { verifyAuth } from '../../lib/auth';
import { AboutContent, sequelize } from '../../../lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    
    let count = await AboutContent.count();
    
    // Auto-seed default about content if empty
    if (count === 0) {
      await AboutContent.create({
        title: 'Cultivating Growth & Generosity',
        subtitle: 'Who We Are',
        motto: 'Together We Grow',
        paragraph1: 'The Emyris Foundation, with its inspiring motto "Together We Grow," is dedicated to fostering community development and personal growth through collaborative efforts. We focus on empowering individuals by providing resources, education, and support systems to help them reach their full potential.',
        paragraph2: 'We encourage people from all walks of life to work together, share knowledge, and build a more inclusive and supportive society. Whether through workshops, community projects, or mentorship programs, the foundation aims to create environments where everyone can thrive and contribute to a brighter future.'
      });
    }

    const content = await AboutContent.findOne();
    return NextResponse.json(content || {});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  if (!verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET);

    const body = await req.json();
    
    let content = await AboutContent.findOne();
    
    if (content) {
      content = await content.update(body);
    } else {
      content = await AboutContent.create(body);
    }
    
    return NextResponse.json({ message: 'Updated successfully', content });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Unauthorized or Server error' }, { status: 401 });
  }
}
