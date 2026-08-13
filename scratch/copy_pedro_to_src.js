import fs from 'fs';
import path from 'path';

const SRC_DIR = 'c:/Users/USER/Documents/web3meme/public/assets/pedro/nobg';
const DEST_DIR = 'c:/Users/USER/Documents/web3meme/src/assets/pedro';

if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.png'));

for (const file of files) {
  const srcFile = path.join(SRC_DIR, file);
  const destFile = path.join(DEST_DIR, file);
  fs.copyFileSync(srcFile, destFile);
  console.log(`Copied [${file}] -> src/assets/pedro/${file}`);
}

console.log('Successfully copied all Pedro PNG files to src/assets/pedro/');
