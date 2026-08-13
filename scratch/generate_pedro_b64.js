import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const dir = path.join(projectRoot, 'public', 'assets', 'pedro', 'nobg');
const keys = ['clown', 'copium', 'diamond', 'rekt', 'rocket', 'rockstar', 'wizard'];

let code = '// Auto-generated Pedro Raccoon Base64 Data URIs for 100% synchronous canvas export\n';
code += 'export const PEDRO_DATA_URIS = {\n';

keys.forEach(key => {
  const filePath = path.join(dir, `pedro_${key}.png`);
  if (fs.existsSync(filePath)) {
    const buf = fs.readFileSync(filePath);
    const b64 = buf.toString('base64');
    code += `  ${key}: 'data:image/png;base64,${b64}',\n`;
  }
});

code += '};\n';

const assetsDir = path.join(projectRoot, 'src', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const targetPath = path.join(assetsDir, 'pedroDataURIs.js');
fs.writeFileSync(targetPath, code);
console.log('Successfully generated pedroDataURIs.js at:', targetPath);
