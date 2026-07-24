const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, 'public');

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        const newPath = fullPath.substring(0, fullPath.lastIndexOf('.')) + '.webp';
        console.log(`Converting: ${fullPath} -> ${newPath}`);
        
        try {
          await sharp(fullPath)
            .webp({ quality: 80 })
            .toFile(newPath);
          
          console.log(`Successfully converted. Deleting original: ${fullPath}`);
          fs.unlinkSync(fullPath);
        } catch (error) {
          console.error(`Error converting ${fullPath}:`, error);
        }
      }
    }
  }
}

async function run() {
  console.log('Starting image conversion...');
  await processDirectory(publicDir);
  console.log('Finished converting all images to WebP.');
}

run();
