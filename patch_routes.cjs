/**
 * This script patches all PUT handlers in the API routes to add:
 * 1. `updatedBy` stamping from JWT
 * 2. Optimistic lock conflict detection using `lastKnownUpdatedAt`
 */
const fs = require('fs');
const path = require('path');

// Routes to patch — each has a Model name and file path
const routes = [
  { file: 'src/app/api/directors/route.js', model: 'Director' },
  { file: 'src/app/api/mentors/route.js', model: 'Mentor' },
  { file: 'src/app/api/campaigns/route.js', model: 'Campaign' },
  { file: 'src/app/api/work/route.js', model: 'WorkActivity' },
  { file: 'src/app/api/hero/route.js', model: 'HeroSlide' },
  { file: 'src/app/api/publications/route.js', model: 'Publication' },
  { file: 'src/app/api/menus/route.js', model: 'MenuLink' },
  { file: 'src/app/api/hero-stats/route.js', model: 'HeroStat' },
  { file: 'src/app/api/presence/route.js', model: 'PresenceLocation' },
  { file: 'src/app/api/content/route.js', model: 'SectionContent' },
];

// The new PUT handler template — inserts conflict detection + updatedBy stamping
function buildPutBlock(model) {
  return `export async function PUT(req) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const updatedBy = decoded.username || 'unknown';

    const body = await req.json();
    const { lastKnownUpdatedAt, ...data } = body;

    const item = await ${model}.findByPk(data.id);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Conflict detection: someone else saved after this user loaded the record
    if (lastKnownUpdatedAt) {
      const dbTime = new Date(item.updatedAt).getTime();
      const clientTime = new Date(lastKnownUpdatedAt).getTime();
      if (dbTime > clientTime) {
        return NextResponse.json({
          conflict: true,
          updatedBy: item.updatedBy || 'unknown',
          updatedAt: item.updatedAt,
        }, { status: 409 });
      }
    }

    await item.update({ ...data, updatedBy });
    return NextResponse.json({ message: 'Updated', item });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Unauthorized or error' }, { status: 401 });
  }
}`;
}

// Also patch POST to stamp updatedBy
function buildPostBlock(model, extraBody = '') {
  return `export async function POST(req) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const updatedBy = decoded.username || 'unknown';
    const body = await req.json();
    const item = await ${model}.create({ ...body, updatedBy });
    return NextResponse.json({ message: 'Created', item });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Unauthorized or error' }, { status: 401 });
  }
}`;
}

routes.forEach(({ file, model }) => {
  try {
    let content = fs.readFileSync(file, 'utf8');

    // Replace the PUT block
    content = content.replace(
      /export async function PUT\(req\)\s*\{[\s\S]*?\n\}/,
      buildPutBlock(model)
    );

    // Stamp updatedBy in POST — replace simple create calls
    content = content.replace(
      /const item = await \w+\.create\(body\);/,
      `const decoded2 = jwt.verify(req.headers.get('authorization')?.split(' ')[1], JWT_SECRET);\n    const item = await ${model}.create({ ...body, updatedBy: decoded2.username || 'unknown' });`
    );

    fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ Patched: ${file}`);
  } catch (err) {
    console.error(`❌ Failed: ${file}`, err.message);
  }
});

console.log('\nAll routes patched.');
