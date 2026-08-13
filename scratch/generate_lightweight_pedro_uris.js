import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PEDRO_DIR = 'c:/Users/USER/Documents/web3meme/public/assets/pedro/nobg';
const OUTPUT_FILE = 'c:/Users/USER/Documents/web3meme/src/assets/pedroDataURIs.js';

const FILES = {
  clown: 'pedro_clown.png',
  copium: 'pedro_copium.png',
  diamond: 'pedro_diamond.png',
  rekt: 'pedro_rekt.png',
  rocket: 'pedro_rocket.png',
  rockstar: 'pedro_rockstar.png',
  wizard: 'pedro_wizard.png',
};

async function main() {
  console.log('Generating lightweight Base64 Data URIs for Pedro assets...');
  const uris = {};

  for (const [key, filename] of Object.entries(FILES)) {
    const inputPath = path.join(PEDRO_DIR, filename);
    if (!fs.existsSync(inputPath)) {
      console.error(`File missing: ${inputPath}`);
      continue;
    }

    // Resize to max 400x400 transparent PNG and compress with pngquant/png compression
    const buffer = await sharp(inputPath)
      .resize(400, 400, { fit: 'inside' })
      .png({ compressionLevel: 9, quality: 80 })
      .toBuffer();

    const base64 = buffer.toString('base64');
    const dataUri = `data:image/png;base64,${base64}`;
    uris[key] = dataUri;
    console.log(`Key: [${key}] | Size: ${(base64.length / 1024).toFixed(1)} KB`);
  }

  const jsContent = `// Auto-generated Lightweight Pedro Raccoon Base64 Data URIs (~250KB total)
export const PEDRO_DATA_URIS = ${JSON.stringify(uris, null, 2)};
`;

  fs.writeFileSync(OUTPUT_FILE, jsContent, 'utf8');
  console.log(`\nSuccessfully saved lightweight Base64 Data URIs to ${OUTPUT_FILE}`);
  console.log(`Total JS File Size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1)} KB`);
}

main();
