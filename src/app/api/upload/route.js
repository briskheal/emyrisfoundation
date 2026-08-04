import { NextResponse } from 'next/server';
import { verifyAuth } from '../../../lib/auth';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  if (!verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await fs.access(uploadsDir);
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    
    // The client already converts images to WebP. Just save the file with its extension.
    const ext = (file.name && path.extname(file.name)) ? path.extname(file.name).toLowerCase() : '.bin';
    const filename = `media-${uniqueSuffix}${ext}`;
    const filepath = path.join(uploadsDir, filename);
    
    await fs.writeFile(filepath, buffer);

    return NextResponse.json({ 
      success: true, 
      url: `/api/media/${filename}` 
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process file' }, { status: 500 });
  }
}
