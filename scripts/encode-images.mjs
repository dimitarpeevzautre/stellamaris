#!/usr/bin/env node
import { readdir, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('../public/images', import.meta.url));
const MAX_EDGE = 1600;
const QUALITY = 82;
const SOURCE_EXTS = new Set(['.jpg', '.jpeg', '.png']);

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile()) yield full;
  }
}

async function encode(src) {
  const dest = src.replace(/\.(jpe?g|png)$/i, '.webp');

  try {
    const [srcStat, destStat] = await Promise.all([stat(src), stat(dest).catch(() => null)]);
    if (destStat && destStat.mtimeMs >= srcStat.mtimeMs) {
      return { src, dest, skipped: true };
    }
  } catch {
    // fall through and encode
  }

  const image = sharp(src, { failOn: 'none' });
  const meta = await image.metadata();
  const longest = Math.max(meta.width ?? 0, meta.height ?? 0);
  const pipeline = longest > MAX_EDGE
    ? image.resize({ width: meta.width >= meta.height ? MAX_EDGE : undefined, height: meta.height > meta.width ? MAX_EDGE : undefined, withoutEnlargement: true })
    : image;

  await pipeline.webp({ quality: QUALITY }).toFile(dest);
  return { src, dest, skipped: false };
}

const results = [];
for await (const file of walk(ROOT)) {
  if (!SOURCE_EXTS.has(extname(file).toLowerCase())) continue;
  try {
    results.push(await encode(file));
  } catch (err) {
    console.error(`FAILED ${file}:`, err.message);
    process.exitCode = 1;
  }
}

const encoded = results.filter(r => !r.skipped).length;
const skipped = results.filter(r => r.skipped).length;
console.log(`Encoded ${encoded}, skipped ${skipped}, total ${results.length}.`);
