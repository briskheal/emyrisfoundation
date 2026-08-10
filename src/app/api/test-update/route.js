import { NextResponse } from 'next/server';
import { NewsActivity } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Create a dummy record
    const item = await NewsActivity.create({
      title: 'Update Test Entry',
      content: 'Original content'
    });
    
    // 2. Perform the exact update logic from news/[id]
    const body = { content: 'This is the UPDATED content!' };
    await item.update(body);
    
    // 3. Fetch it back to prove it persisted
    const fetchedItem = await NewsActivity.findByPk(item.id);
    
    return NextResponse.json({
      success: true,
      originalId: item.id,
      updatedContent: fetchedItem.content
    });
  } catch (err) {
    return NextResponse.json({ error: err.message, stack: err.stack });
  }
}
