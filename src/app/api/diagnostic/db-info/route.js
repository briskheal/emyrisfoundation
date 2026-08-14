import { NextResponse } from 'next/server';
import { sequelize } from '../../../../lib/db';
import { verifyAuth } from '../../../../lib/auth';
import fs from 'fs';

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
      const fsStats = fs.statSync(sequelize.options.storage || 'database.sqlite');
      totalDbSizeBytes = fsStats.size;
      tablesResult = [{ table_name: 'sqlite_db', size_bytes: fsStats.size }];
    }

    // 3. Get server free space
    let totalServerBytes = 0;
    let freeServerBytes = 0;
    try {
      const rootPath = process.platform === 'win32' ? process.cwd().substring(0, 3) : '/';
      const stat = fs.statfsSync(rootPath);
      totalServerBytes = stat.blocks * stat.bsize;
      freeServerBytes = stat.bfree * stat.bsize;
    } catch (fsErr) {
      console.error('Error reading filesystem stats:', fsErr);
    }

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
