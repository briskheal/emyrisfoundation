import { NextResponse } from 'next/server';
import { Blog } from '../../../lib/db';
import { verifyAuth } from '../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const blogs = await Blog.findAll({ order: [['publishedAt', 'DESC'], ['order', 'ASC']] });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(req) {
  if (!verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const data = await req.json();
    if (!data.id) {
      data.id = data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : `blog-${Date.now()}`;
    }
    const blog = await Blog.create(data);
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}
