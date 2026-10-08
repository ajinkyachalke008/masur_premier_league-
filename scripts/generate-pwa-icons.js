import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sourceLogo = 'src/assets/mpl-official.webp';
const outDir = 'public';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function generate() {
  console.log('Generating PWA icons from:', sourceLogo);

  // 1. Generate Favicon (32x32, 48x48, 64x64) with transparent background
  const logoBuffer = await sharp(sourceLogo)
    .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp(logoBuffer).resize(32, 32).toFile(path.join(outDir, 'favicon.png'));
  await sharp(logoBuffer).resize(32, 32).toFile(path.join(outDir, 'favicon-32x32.png'));
  await sharp(logoBuffer).resize(16, 16).toFile(path.join(outDir, 'favicon-16x16.png'));
  await sharp(logoBuffer).resize(48, 48).toFile(path.join(outDir, 'favicon.ico'));

  // Helper to create an icon with a solid dark #0d0907 circular/rounded stadium-themed background
  async function createSquareAppIcon(size, paddingPercent = 0.15) {
    const innerSize = Math.round(size * (1 - paddingPercent * 2));
    const innerLogo = await sharp(sourceLogo)
      .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 13, g: 9, b: 7, alpha: 1 }, // #0d0907
      },
    })
      .composite([
        {
          input: innerLogo,
          gravity: 'center',
        },
      ])
      .png();
  }

  // 2. Apple Touch Icon (180x180)
  const appleIcon = await createSquareAppIcon(180, 0.12);
  await appleIcon.toFile(path.join(outDir, 'apple-touch-icon.png'));

  // 3. PWA 192x192
  const pwa192 = await createSquareAppIcon(192, 0.12);
  await pwa192.toFile(path.join(outDir, 'pwa-192x192.png'));

  // 4. PWA 512x512
  const pwa512 = await createSquareAppIcon(512, 0.12);
  await pwa512.toFile(path.join(outDir, 'pwa-512x512.png'));

  // 5. Maskable Icon 512x512 (Safe zone is 80% diameter, so 20% padding)
  const maskable512 = await createSquareAppIcon(512, 0.20);
  await maskable512.toFile(path.join(outDir, 'maskable-icon-512x512.png'));

  console.log('All PWA and favicon icons generated successfully!');
}

generate().catch(console.error);
