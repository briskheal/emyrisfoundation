import { NextResponse } from 'next/server';
import { NewsActivity } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const item = await NewsActivity.create({
      title: 'Diagnostic Test Entry',
      content: 'If you can read this, the database successfully saved the content column.'
    });
    
    // Fetch it back to prove it persisted
    const fetchedItem = await NewsActivity.findByPk(item.id);
    
    return NextResponse.json({
      success: true,
      created: item,
      fetched: fetchedItem
    });
  } catch (err) {
    return NextResponse.json({ error: err.message, stack: err.stack });
  }
}
