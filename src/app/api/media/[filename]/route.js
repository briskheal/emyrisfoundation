import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const { filename } = await params;
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

    const file = await fs.readFile(filepath);
    
    let contentType = 'image/webp';
    if (filename.toLowerCase().endsWith('.pdf')) {
      contentType = 'application/pdf';
    } else if (filename.toLowerCase().endsWith('.png')) {
      contentType = 'image/png';
    } else if (filename.toLowerCase().endsWith('.jpg') || filename.toLowerCase().endsWith('.jpeg')) {
      contentType = 'image/jpeg';
    }
    
    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('Dynamic Upload Route Error:', err);
    return new NextResponse('File not found', { status: 404 });
  }
}
