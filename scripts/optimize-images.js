import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join, basename, extname } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;

const images = [
  { src: 'photo1.jpg',     quality: 82 },
  { src: 'photo2.jpg',     quality: 82 },
  { src: 'photo3.jpg',     quality: 82 },
  { src: 'photo4.jpg',     quality: 82 },
  { src: 'photo5.jpg',     quality: 82 },
  { src: 'photo6.png',     quality: 82 },
  { src: 'place1.jpg',     quality: 82 },
  { src: 'place2.jpg',     quality: 82 },
  { src: 'heart-final.png', quality: 85 },
];

// Resized variants for specific breakpoints
const resizedVariants = [
  // Mobile (max 800px wide)
  { src: 'photo1.jpg', width: 800,  quality: 80, out: 'photo1-mobile' },
  { src: 'photo4.jpg', width: 800,  quality: 80, out: 'photo4-mobile' },
  { src: 'photo5.jpg', width: 800,  quality: 80, out: 'photo5-mobile' },
  // Desktop (max 1440px wide)
  { src: 'photo3.jpg', width: 1440, quality: 82, out: 'photo3-desktop' },
  { src: 'photo4.jpg', width: 1440, quality: 82, out: 'photo4-desktop' },
  { src: 'photo5.jpg', width: 1440, quality: 82, out: 'photo5-desktop' },
];

async function optimize(file) {
  const src = join(ROOT, file.src);
  if (!existsSync(src)) {
    console.warn(`  skip (not found): ${file.src}`);
    return;
  }

  const ext = extname(file.src).toLowerCase();
  const name = basename(file.src, ext);
  const isJpeg = ext === '.jpg' || ext === '.jpeg';

  const img = sharp(src);
  const meta = await img.metadata();
  const origSize = (await img.toBuffer()).length;

  // Overwrite original with compressed version
  if (isJpeg) {
    await sharp(src)
      .jpeg({ quality: file.quality, progressive: true, mozjpeg: true })
      .toFile(src + '.tmp');
  } else {
    await sharp(src)
      .png({ compressionLevel: 9, quality: file.quality })
      .toFile(src + '.tmp');
  }
  const { rename } = await import('fs/promises');
  await rename(src + '.tmp', src);

  // Create WebP version
  const webpDest = join(ROOT, name + '.webp');
  await sharp(src)
    .webp({ quality: file.quality, effort: 5 })
    .toFile(webpDest);

  const compressedBuf = await sharp(src).toBuffer();
  const webpBuf = await sharp(webpDest).toBuffer();

  const pct = (n, orig) => ((1 - n / orig) * 100).toFixed(0) + '%';
  console.log(
    `${file.src.padEnd(16)} ${kb(origSize)} → ${kb(compressedBuf.length)} (−${pct(compressedBuf.length, origSize)})` +
    `   webp: ${kb(webpBuf.length)} (−${pct(webpBuf.length, origSize)})`
  );
}

async function optimizeMobile({ src, width, quality, out }) {
  const srcPath = join(ROOT, src);
  if (!existsSync(srcPath)) {
    console.warn(`  skip (not found): ${src}`);
    return;
  }
  const origSize = (await sharp(srcPath).toBuffer()).length;

  const jpgDest = join(ROOT, out + '.jpg');
  await sharp(srcPath)
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality, progressive: true, mozjpeg: true })
    .toFile(jpgDest);

  const webpDest = join(ROOT, out + '.webp');
  await sharp(srcPath)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toFile(webpDest);

  const jpgBuf = await sharp(jpgDest).toBuffer();
  const webpBuf = await sharp(webpDest).toBuffer();
  const pct = (n, orig) => ((1 - n / orig) * 100).toFixed(0) + '%';
  console.log(
    `${(out + '.jpg').padEnd(20)} ${kb(origSize)} → ${kb(jpgBuf.length)} (−${pct(jpgBuf.length, origSize)})` +
    `   webp: ${kb(webpBuf.length)} (−${pct(webpBuf.length, origSize)})`
  );
}

const kb = b => (b / 1024).toFixed(0) + 'kb';

console.log('Optimizing images...\n');
for (const img of images) {
  await optimize(img);
}

console.log('\nGenerating resized variants...\n');
for (const v of resizedVariants) {
  await optimizeMobile(v);
}

console.log('\nDone.');
