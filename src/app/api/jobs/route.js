import { NextResponse } from 'next/server';
import { JobOpening } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const jobs = await JobOpening.findAll({
      order: [['order', 'ASC'], ['createdAt', 'DESC']]
    });
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const jobs = await request.json();
    
    if (!Array.isArray(jobs)) {
      return NextResponse.json({ error: 'Expected array of jobs' }, { status: 400 });
    }

    // Wipe table and replace all (matching old file-save behavior)
    await JobOpening.destroy({ where: {}, truncate: true });
    
    const jobsWithOrder = jobs.map((job, index) => ({
      ...job,
      order: index
    }));
    
    await JobOpening.bulkCreate(jobsWithOrder);
    
    return NextResponse.json({ success: true, message: 'Jobs data updated successfully' });
  } catch (error) {
    console.error('Error updating jobs:', error);
    return NextResponse.json({ error: 'Failed to update jobs' }, { status: 500 });
  }
}
