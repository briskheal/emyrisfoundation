import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'jobs.json');

export async function GET() {
  try {
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const jobs = JSON.parse(fileContents);
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read jobs data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const jobs = await request.json();
    
    // Ensure the data directory exists
    const dataDir = path.dirname(dataFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(jobs, null, 2), 'utf8');
    return NextResponse.json({ success: true, message: 'Jobs data updated successfully' });
  } catch (error) {
    console.error('Error saving jobs data:', error);
    return NextResponse.json({ error: 'Failed to save jobs data' }, { status: 500 });
  }
}
