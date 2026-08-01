const fs = require('fs');
const path = require('path');

const filesToPatch = [
  'src/app/api/about/route.js',
  'src/app/api/campaign-details/[id]/route.js',
  'src/app/api/content/route.js',
  'src/app/api/corporate/route.js',
  'src/app/api/donations/route.js',
  'src/app/api/hero-stats/route.js',
  'src/app/api/jobs/route.js',
  'src/app/api/menus/route.js',
  'src/app/api/presence/route.js',
  'src/app/api/upload/route.js',
  'src/app/api/work-details/[id]/route.js'
];

const checkStr = "if (!verifyAuth(req) && !verifyAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });";

for (const file of filesToPatch) {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Find relative path depth to import auth.js
  const depth = file.split('/').length - 3;
  let importPath = '';
  for(let i=0; i<depth; i++) importPath += '../';
  importPath += 'lib/auth';

  if (!content.includes('verifyAuth')) {
    content = content.replace(/(import { NextResponse } from 'next\/server';)/, `$1\nimport { verifyAuth } from '${importPath}';`);
  }

  // Replace export async function POST(req) {
  content = content.replace(/export async function (POST|PUT|DELETE)\((req|request)([^)]*)\)\s*{/g, (match, method, reqVar, rest) => {
    return `${match}\n  if (!verifyAuth(${reqVar})) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });`;
  });

  fs.writeFileSync(fullPath, content);
  console.log(`Patched ${file}`);
}
