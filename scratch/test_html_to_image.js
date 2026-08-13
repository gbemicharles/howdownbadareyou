import fs from 'fs';
import path from 'path';

// Check if pedro assets exist and can be converted to Base64
const pedroPath = path.resolve('src/assets/pedro/pedro_rockstar.png');
if (fs.existsSync(pedroPath)) {
  const buf = fs.readFileSync(pedroPath);
  const base64 = `data:image/png;base64,${buf.toString('base64')}`;
  console.log(`Pedro rockstar PNG loaded successfully (${buf.length} bytes, base64 length: ${base64.length})`);
} else {
  console.error(`Pedro rockstar PNG NOT FOUND at ${pedroPath}`);
}
