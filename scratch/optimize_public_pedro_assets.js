import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PEDRO_DIR = 'c:/Users/USER/Documents/web3meme/public/assets/pedro/nobg';

async function main() {
  console.log('Optimizing public Pedro PNG assets to 512x512 transparent PNGs...');
  const files = fs.readdirSync(PEDRO_DIR).filter(f => f.endsWith('.png'));

  for (const file of files) {
    const inputPath = path.join(PEDRO_DIR, file);
    const tempPath = path.join(PEDRO_DIR, `temp_${file}`);

    const buffer = await sharp(inputPath)
      .resize(512, 512, { fit: 'inside' })
      .png({ compressionLevel: 9, quality: 85 })
      .toBuffer();

    fs.writeFileSync(tempPath, buffer);
    fs.renameSync(tempPath, inputPath);

    const sizeKb = (fs.statSync(inputPath).size / 1024).toFixed(1);
    console.log(`Optimized [${file}] -> ${sizeKb} KB`);
  }

  console.log('\nAll public Pedro PNG assets successfully optimized!');
}

main();
