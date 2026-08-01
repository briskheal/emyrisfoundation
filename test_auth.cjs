const fs = require('fs');
const path = require('path');
const apiDir = path.join(process.cwd(), 'src/app/api');
let missingAuth = [];
function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const matches = [...content.matchAll(/export async function (POST|PUT|DELETE)[^{]*{([^}]*)/g)];
      for (const match of matches) {
        const method = match[1];
        const body = match[2];
        if (!body.includes('verifyAuth') && !body.includes('verifyToken') && !body.includes('jwt.verify') && !body.includes('rateLimit')) {
          missingAuth.push(`${fullPath} - ${method}`);
        }
      }
    }
  }
}
scanDir(apiDir);
console.log(missingAuth.join('\n'));
