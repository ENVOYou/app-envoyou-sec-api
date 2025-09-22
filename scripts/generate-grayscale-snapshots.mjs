#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const screenshotsRoot = path.join(process.cwd(), 'tests/visual/__screenshots__');
const outRoot = path.join(process.cwd(), 'tests/visual/__screenshots__', '__grayscale__');

async function ensureDir(dir) { await fs.mkdir(dir, { recursive: true }); }

async function processDir(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('__grayscale__')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { await processDir(full); continue; }
    if (!/\.(png|jpg|jpeg)$/i.test(e.name)) continue;
    const rel = path.relative(screenshotsRoot, full);
    const targetDir = path.join(outRoot, path.dirname(rel));
    await ensureDir(targetDir);
    const outPath = path.join(targetDir, e.name.replace(/\.(png|jpg|jpeg)$/i, '.gray.png'));
    const buf = await sharp(full).grayscale().toBuffer();
    await fs.writeFile(outPath, buf);
    console.log('Grayscale:', rel, '->', path.relative(process.cwd(), outPath));
  }
}

(async () => {
  try {
    await ensureDir(outRoot);
    await processDir(screenshotsRoot);
    console.log('\nDone generating grayscale variants.');
  } catch (e) {
    console.error('Failed generating grayscale snapshots:', e);
    process.exit(1);
  }
})();
