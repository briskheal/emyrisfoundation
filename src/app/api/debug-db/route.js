import { NextResponse } from 'next/server';
import { sequelize } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    // Only alter if explicitly requested via query param ?sync=true
    const { searchParams } = new URL(req.url);
    if (searchParams.get('sync') === 'true') {
      await sequelize.sync({ alter: true });
      return NextResponse.json({ message: 'Database synchronized and altered to match models.' });
    }

    const [results] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'NewsActivities';
    `);
    
    const [data] = await sequelize.query(`
      SELECT id, title, content FROM "NewsActivities" ORDER BY id DESC LIMIT 5;
    `);

    return NextResponse.json({ columns: results, recentData: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
