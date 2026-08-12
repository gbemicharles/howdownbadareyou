import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicPedroDir = path.resolve('public/assets/pedro');
const outputDir = path.resolve('public/assets/pedro/nobg');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const pedroFiles = [
  'pedro_rockstar.png',
  'pedro_rekt.png',
  'pedro_copium.png',
  'pedro_wizard.png',
  'pedro_diamond.png',
  'pedro_rocket.png',
  'pedro_clown.png'
];

async function removeDarkBackground(fileName) {
  const filePath = path.join(publicPedroDir, fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  try {
    const { data, info } = await sharp(filePath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    let modifiedCount = 0;
    // Loop through pixels RGBA
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // If dark background pixel (R < 45, G < 45, B < 45) -> set Alpha to 0 (100% transparent)
      if (r < 45 && g < 45 && b < 45) {
        data[i + 3] = 0;
        modifiedCount++;
      }
    }

    const outputFile = path.join(outputDir, fileName);

    // Save transparent image to nobg folder
    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
    .png()
    .toFile(outputFile);

    console.log(`✓ Saved 100% TRANSPARENT PNG: ${outputFile} (${modifiedCount} dark background pixels removed!)`);
  } catch (err) {
    console.error(`Error processing ${fileName}:`, err);
  }
}

async function runAll() {
  console.log('Stripping dark backgrounds from all 7 Pedro raccoon PNGs into nobg folder...');
  for (const file of pedroFiles) {
    await removeDarkBackground(file);
  }
  console.log('🎉 All 7 Pedro raccoon character PNG images are now saved in public/assets/pedro/nobg/ as 100% TRANSPARENT PNGs!');
}

runAll();
