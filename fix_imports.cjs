const fs = require('fs');
const filesToPatchDepth3 = [
  'src/app/api/about/route.js',
  'src/app/api/content/route.js',
  'src/app/api/corporate/route.js',
  'src/app/api/donations/route.js',
  'src/app/api/hero-stats/route.js',
  'src/app/api/jobs/route.js',
  'src/app/api/menus/route.js',
  'src/app/api/presence/route.js',
  'src/app/api/upload/route.js'
];
const filesToPatchDepth4 = [
  'src/app/api/campaign-details/[id]/route.js',
  'src/app/api/work-details/[id]/route.js'
];
for (const file of filesToPatchDepth3) {
  const p = require('path').join(process.cwd(), file);
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(/import \{ verifyAuth \} from '\.\.\/\.\.\/lib\/auth';/g, "import { verifyAuth } from '../../../lib/auth';");
  fs.writeFileSync(p, c);
}
for (const file of filesToPatchDepth4) {
  const p = require('path').join(process.cwd(), file);
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(/import \{ verifyAuth \} from '\.\.\/\.\.\/\.\.\/lib\/auth';/g, "import { verifyAuth } from '../../../../lib/auth';");
  fs.writeFileSync(p, c);
}
