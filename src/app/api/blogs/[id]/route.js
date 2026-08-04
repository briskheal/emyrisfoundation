import { NextResponse } from 'next/server';
import { Blog } from '../../../../lib/db';
import { verifyAuth } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const blog = await Blog.findByPk(id);
    if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  if (!verifyAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    const data = await request.json();
    const blog = await Blog.findByPk(id);
    if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    await blog.update(data);
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!verifyAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    const blog = await Blog.findByPk(id);
    if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    await blog.destroy();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
