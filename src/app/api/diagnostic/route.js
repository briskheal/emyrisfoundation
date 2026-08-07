import { NextResponse } from 'next/server';
import { sequelize, ApplicationSubmission } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    // 1. Force a sync just to ensure the table absolutely exists and matches schema
    await sequelize.sync({ alter: true });

    // 2. Insert a dummy record
    const newRecord = await ApplicationSubmission.create({
      type: 'volunteer',
      position: 'Diagnostic Tester',
      name: 'Diagnostic Dummy',
      email: 'dummy@emyrisfoundation.com',
      phone: '1234567890',
      message: 'This is a diagnostic test record.'
    });

    // 3. Fetch all records to see if the database actually returns them
    const allRecords = await ApplicationSubmission.findAll({ order: [['createdAt', 'DESC']] });

    // 4. Return the raw data and counts
    return NextResponse.json({
      success: true,
      message: 'Diagnostic run successful',
      insertedRecordId: newRecord.id,
      totalRecordsFound: allRecords.length,
      records: allRecords,
    });
  } catch (error) {
    console.error('Diagnostic error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
