import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export async function POST(req) {
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

    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

    if (isPdf) {
      const filename = `doc-${uniqueSuffix}.pdf`;
      const filepath = path.join(uploadsDir, filename);
      await fs.writeFile(filepath, buffer);
      return NextResponse.json({ success: true, url: `/uploads/${filename}` });
    }

    const filename = `img-${uniqueSuffix}.webp`;
    const filepath = path.join(uploadsDir, filename);

    // Convert to webp using sharp
    await sharp(buffer)
      .webp({ quality: 80 })
      .toFile(filepath);

    return NextResponse.json({ 
      success: true, 
      url: `/uploads/${filename}` 
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
}
