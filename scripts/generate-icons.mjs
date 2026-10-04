#!/usr/bin/env node
/**
 * Prebuild step: renders the site icons from public/favicon.svg (the single source of the brand mark).
 *
 *   public/favicon.ico               16, 32 and 48 px PNGs packed into one ICO (browsers request /favicon.ico)
 *   public/apple-touch-icon.png      180 px, full-bleed (iOS rounds the corners itself)
 *   public/icon-192.png, icon-512.png       rounded, for the web app manifest (purpose "any")
 *   public/icon-maskable-512.png     full-bleed with the mark inside the maskable safe zone
 *   public/images/logo.png           512 px square logo for structured data (JSON-LD "logo")
 *
 * Skips the work when every output exists and neither favicon.svg nor this script changed since the last
 * run (content hash in scripts/generate-icons.state.json, commit it with the icons; modification times
 * cannot be used because a fresh git checkout, e.g. on CI, makes every file look new). `--force` redoes it.
 */
import { createHash } from 'node:crypto';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

sharp.cache(false);

const PUBLIC = fileURLToPath(new URL('../public', import.meta.url));
const SOURCE = join(PUBLIC, 'favicon.svg');
const STATE_FILE = fileURLToPath(new URL('./generate-icons.state.json', import.meta.url));
const BLUE = '#1e3a8a';
const FORCE = process.argv.includes('--force');

const svg = await readFile(SOURCE, 'utf8');
const VIEWBOX = 64;

/** The mark without its background, e.g. to place it on a full-bleed square. */
const mark = svg
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<svg[^>]*>|<\/svg>/g, '')
  .replace(/<rect[^>]*\/>/, '');

/** Square background with the mark scaled to `scale` of the canvas, centred. */
const squareSvg = (scale) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEWBOX} ${VIEWBOX}">
  <rect width="${VIEWBOX}" height="${VIEWBOX}" fill="${BLUE}"/>
  <g transform="translate(32 32) scale(${scale}) translate(-32 -32)">${mark}</g>
</svg>`;

const render = (source, size) =>
  sharp(Buffer.from(source), { density: (72 * size) / VIEWBOX })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();

/** ICO container holding PNG images (supported by every current browser and Windows). */
const toIco = (images) => {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  let offset = 6 + 16 * images.length;
  for (const { size, data } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette colours
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(entry);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
};

const outputs = {
  'favicon.ico': async () =>
    toIco(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await render(svg, size) })))),
  'apple-touch-icon.png': () => render(squareSvg(0.82), 180),
  'icon-192.png': () => render(svg, 192),
  'icon-512.png': () => render(svg, 512),
  // Maskable safe zone is the centred circle with 80% of the width; the mark stays inside it.
  'icon-maskable-512.png': () => render(squareSvg(0.62), 512),
  'images/logo.png': () => render(squareSvg(0.82), 512),
};

const exists = async (file) => (await stat(file).catch(() => null)) !== null;
// Line endings are normalised so a Windows checkout (core.autocrlf) and the Linux CI runner agree.
const normalise = (text) => text.replace(/\r\n/g, '\n');
const inputsHash = createHash('sha1')
  .update(normalise(svg))
  .update(normalise(await readFile(fileURLToPath(import.meta.url), 'utf8')))
  .digest('hex');
const previous = JSON.parse(await readFile(STATE_FILE, 'utf8').catch(() => '{}'));
const unchanged = !FORCE && previous.inputs === inputsHash;

let written = 0;
for (const [file, build] of Object.entries(outputs)) {
  const target = join(PUBLIC, ...file.split('/'));
  if (unchanged && (await exists(target))) continue;
  await writeFile(target, await build());
  written += 1;
}
if (previous.inputs !== inputsHash) await writeFile(STATE_FILE, `${JSON.stringify({ inputs: inputsHash }, null, 2)}\n`);
console.log(`Icons: wrote ${written}, up to date ${Object.keys(outputs).length - written}.`);
