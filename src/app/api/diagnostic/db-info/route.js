import { NextResponse } from 'next/server';
import { sequelize } from '../../../../lib/db';
import { verifyAuth } from '../../../../lib/auth';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const isAuthenticated = await verifyAuth(req);
    if (!isAuthenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
        LIMIT 6;
      `);
      tablesResult = pgTablesResult;
    } else {
      // Fallback for SQLite (local dev)
      totalDbSizeBytes = 1048576; // Mock 1MB
      tablesResult = [{ table_name: 'sqlite_mock_db', size_bytes: 1048576 }];
    }

    // Get size of public/uploads (Gallery/Media)
    let uploadsSizeBytes = 0;
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      const files = await fs.readdir(uploadsDir);
      for (const file of files) {
        const stats = await fs.stat(path.join(uploadsDir, file));
        uploadsSizeBytes += stats.size;
      }
    } catch (e) {
      console.log('No uploads folder or error reading it');
    }

    // 3. Safe Server Free Space calculation via OS commands (prevents Node.js V8 crashes)
    let totalServerBytes = 0;
    let freeServerBytes = 0;
    try {
      const { exec } = require('child_process');
      const util = require('util');
      const execPromise = util.promisify(exec);
      
      if (process.platform === 'win32') {
        const { stdout } = await execPromise('wmic logicaldisk get size,freespace');
        const lines = stdout.split('\n');
        for (let line of lines) {
          const parts = line.trim().split(/\s+/);
          if (parts.length === 2 && !isNaN(parseInt(parts[0], 10)) && !isNaN(parseInt(parts[1], 10))) {
            freeServerBytes = parseInt(parts[0], 10);
            totalServerBytes = parseInt(parts[1], 10);
            break;
          }
        }
      } else {
        const { stdout } = await execPromise('df -k /');
        const lines = stdout.split('\n');
        if (lines.length > 1) {
          const parts = lines[1].trim().split(/\s+/);
          if (parts.length >= 4 && !isNaN(parseInt(parts[1], 10)) && !isNaN(parseInt(parts[3], 10))) {
            totalServerBytes = parseInt(parts[1], 10) * 1024;
            freeServerBytes = parseInt(parts[3], 10) * 1024;
          }
        }
      }
    } catch (e) {
      console.log('Error getting server space via command line', e);
    }

    return NextResponse.json({ 
      success: true, 
      db: {
        totalBytes: totalDbSizeBytes,
        tables: tablesResult.map(t => ({ name: t.table_name, bytes: parseInt(t.size_bytes, 10) }))
      },
      media: {
        totalBytes: uploadsSizeBytes
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
