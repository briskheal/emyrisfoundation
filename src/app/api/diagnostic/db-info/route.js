import { NextResponse } from 'next/server';
import { sequelize } from '../../../../lib/db';
import { verifyAuth } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const authError = await verifyAuth(req);
    if (authError) return authError;

    let totalDbSizeBytes = 0;
    let tablesResult = [];

    // Check if dialect is postgres
    if (sequelize.getDialect() === 'postgres') {
      const [dbSizeResult] = await sequelize.query(`SELECT pg_database_size(current_database()) as size_bytes`);
      totalDbSizeBytes = parseInt(dbSizeResult[0]?.size_bytes || 0, 10);

      const [pgTablesResult] = await sequelize.query(`
        SELECT relname as table_name, pg_total_relation_size(relid) as size_bytes
        FROM pg_catalog.pg_statio_user_tables
        ORDER BY pg_total_relation_size(relid) DESC
        LIMIT 5;
      `);
      tablesResult = pgTablesResult;
    } else {
      // Fallback for SQLite (local dev)
      totalDbSizeBytes = 1048576; // Mock 1MB
      tablesResult = [{ table_name: 'sqlite_mock_db', size_bytes: 1048576 }];
    }

    // 3. Get server free space (Disabled due to fatal crashes in restricted Docker containers)
    let totalServerBytes = 0;
    let freeServerBytes = 0;


    return NextResponse.json({ 
      success: true, 
      db: {
        totalBytes: totalDbSizeBytes,
        tables: tablesResult.map(t => ({ name: t.table_name, bytes: parseInt(t.size_bytes, 10) }))
      },
      server: {
        totalBytes: totalServerBytes,
        freeBytes: freeServerBytes
      }
    });
  } catch (err) {
    console.error('DB Stats Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
