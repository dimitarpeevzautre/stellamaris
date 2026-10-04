#!/usr/bin/env node
/**
 * Prebuild step: turns the original photos in assets-src/images/ into the files the site
 * serves from public/images/, and writes utils/imageManifest.ts.
 *
 * For every source image `<dir>/<name>.(jpg|jpeg|png)` it writes:
 *   public/images/<dir>/<name>.webp        largest variant (fits MAX_EDGE x MAX_EDGE)
 *   public/images/<dir>/<name>-<w>.webp    narrower variants for srcset (each WIDTHS value below the largest)
 *   public/images/<dir>/<name>.jpg         JPEG fallback for browsers without WebP (fits FALLBACK_EDGE)
 * plus public/images/og-image.jpg (1200x630 link-preview image, see OG below).
 *
 * utils/imageManifest.ts maps each image's public URL ('/images/<dir>/<name>.jpg') to its intrinsic
 * size and available widths; components/Picture.tsx uses it for srcset/sizes and width/height.
 *
 * The originals are NOT deployed (Vite copies public/ only), so multi-MB camera files never reach
 * visitors. Everything this script writes is deterministic (same names and dimensions on Windows and
 * on the Linux CI runner) and is meant to be committed, like the old .webp files were.
 *
 * Idempotent: an image is re-encoded only when one of its outputs is missing, or when the source photo
 * or this script changed. Changes are detected by content hash, recorded in scripts/encode-images.state.json
 * (commit it with the images): file modification times are useless for this, because a fresh git checkout
 * (e.g. on CI) gives every file the same new mtime. `--force` re-encodes everything. Generated .webp/.jpg
 * files in public/images/ that no longer have a source (deleted or renamed photos) are removed.
 */
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rm, rmdir, stat, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCE_DIR = join(ROOT, 'assets-src', 'images');
const OUT_DIR = join(ROOT, 'public', 'images');
const MANIFEST_FILE = join(ROOT, 'utils', 'imageManifest.ts');
const SCRIPT_FILE = fileURLToPath(import.meta.url);
const STATE_FILE = join(ROOT, 'scripts', 'encode-images.state.json');

const MAX_EDGE = 1600;
const WIDTHS = [480, 960];
const WEBP_QUALITY = 80;
const FALLBACK_EDGE = 1200;
const JPEG_QUALITY = 75;
const SOURCE_EXTS = new Set(['.jpg', '.jpeg', '.png']);
const FORCE = process.argv.includes('--force');

// libvips can keep files it has read open; on Windows that blocks overwriting them. So existing
// outputs are only ever read through a Buffer, and outputs are written with fs, not by libvips.
sharp.cache(false);

/** Encode a pipeline and write it with fs; resolves to sharp's output info (width, height, ...). */
const save = async (pipeline, file) => {
  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
  await writeFile(file, data);
  return info;
};

/** Dog portraits (Our Dogs): with these settings each WebP is smaller than a JPEG of the same size. */
const PORTRAIT_WEBP = { quality: 72, effort: 6, smartSubsample: true };

/**
 * Per-image overrides, keyed by path relative to assets-src/images (forward slashes).
 *  aspect   crop the centre to this width/height ratio before resizing
 *  maxEdge  smaller largest variant
 *  widths   srcset widths to emit below the largest (default WIDTHS; listed widths are always kept)
 *  blur     gaussian blur sigma, applied after resizing
 *  quality  WebP/JPEG quality
 *  webp     extra sharp WebP options (e.g. quality, effort, smartSubsample), override `quality` for WebP only
 */
const OPTIONS = {
  // Our Dogs LCP images. Fur detail made them heavier than the JPEG fallback at the default WebP
  // settings, hence PORTRAIT_WEBP; the extra 720w variant serves 360px-wide phones at 2x.
  // arthy.jpg is only ever shown in 4:5 portrait boxes. Cropping here means phones no longer download
  // the ~half of a landscape photo that object-cover throws away. The dog stands in the centre.
  'arthy.jpg': { aspect: 4 / 5, widths: [480, 720, 960], webp: PORTRAIT_WEBP },
  'riva.jpg': { widths: [480, 720, 960], webp: PORTRAIT_WEBP },
  // Decorative background behind the testimonials at 20% opacity: a small, soft copy is enough.
  'steliandpuppy.jpg': { maxEdge: 640, widths: [], blur: 2, quality: 50 },
};

/** Link-preview image (Open Graph / Twitter / JSON-LD). Cropped from the bottom so the photographer's credit stays in frame. */
const OG = { source: 'family.jpeg', output: 'og-image.jpg', width: 1200, height: 630, position: 'bottom', quality: 80 };

const toPosix = (p) => p.split(sep).join('/');

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile()) yield full;
  }
}

const exists = async (file) => (await stat(file).catch(() => null)) !== null;

const sha1 = (...parts) => {
  const hash = createHash('sha1');
  for (const part of parts) hash.update(part);
  return hash.digest('hex');
};

// Line endings are normalised so a Windows checkout (core.autocrlf) and the Linux CI runner agree.
const scriptHash = sha1((await readFile(SCRIPT_FILE, 'utf8')).replace(/\r\n/g, '\n'));
const previousState = JSON.parse(await readFile(STATE_FILE, 'utf8').catch(() => '{}'));
const state = {};

/** Hash of everything an output depends on: the source photo and this script (settings included). */
const inputsHash = async (src) => sha1(scriptHash, await readFile(src));

/** True when every output exists and was produced from the same inputs. */
const isFresh = async (key, hash, outputs) => {
  if (FORCE || previousState[key] !== hash) return false;
  for (const out of outputs) if (!(await exists(out))) return false;
  return true;
};

/** Source pipeline with orientation applied and the optional centre crop. */
const load = async (src, options) => {
  const image = sharp(src, { failOn: 'none' }).rotate();
  if (!options.aspect) return image;
  const meta = await sharp(src, { failOn: 'none' }).metadata();
  const swap = (meta.orientation ?? 1) >= 5;
  const w = swap ? meta.height : meta.width;
  const h = swap ? meta.width : meta.height;
  if (w / h > options.aspect) {
    const width = Math.round(h * options.aspect);
    return image.extract({ left: Math.round((w - width) / 2), top: 0, width, height: h });
  }
  const height = Math.round(w / options.aspect);
  return image.extract({ left: 0, top: Math.round((h - height) / 2), width: w, height });
};

// A narrower default variant only pays off when it is clearly smaller than the largest one;
// widths listed per image are kept as long as they are below the largest.
const variantWidths = (fullWidth, options) => [
  ...(options.widths ?? WIDTHS).filter((w) => w < fullWidth * (options.widths ? 1 : 0.8)),
  fullWidth,
];

const outputsFor = (base, widths, fullWidth) => [
  ...widths.map((w) => (w === fullWidth ? `${base}.webp` : `${base}-${w}.webp`)),
  `${base}.jpg`,
];

async function encode(src) {
  const rel = toPosix(relative(SOURCE_DIR, src));
  const options = OPTIONS[rel] ?? {};
  const base = join(OUT_DIR, rel.replace(/\.(jpe?g|png)$/i, ''));
  const fullPath = `${base}.webp`;
  const hash = await inputsHash(src);
  state[rel] = hash;
  const quality = options.quality;
  const webpOptions = { quality: quality ?? WEBP_QUALITY, ...options.webp };

  // Fast path: the largest variant tells us which narrower ones must exist.
  if (!FORCE && previousState[rel] === hash && (await exists(fullPath))) {
    const meta = await sharp(await readFile(fullPath)).metadata();
    const widths = variantWidths(meta.width, options);
    const outputs = outputsFor(base, widths, meta.width);
    if (await isFresh(rel, hash, outputs)) {
      return { rel, width: meta.width, height: meta.height, widths, outputs, skipped: true };
    }
  }

  await mkdir(dirname(base), { recursive: true });
  const maxEdge = options.maxEdge ?? MAX_EDGE;
  const finish = (pipeline) => (options.blur ? pipeline.blur(options.blur) : pipeline);

  const full = await save(
    finish((await load(src, options)).resize(maxEdge, maxEdge, { fit: 'inside', withoutEnlargement: true })).webp(webpOptions),
    fullPath,
  );

  const widths = variantWidths(full.width, options);
  for (const w of widths) {
    if (w === full.width) continue;
    await save(
      finish((await load(src, options)).resize({ width: w })).webp(webpOptions),
      `${base}-${w}.webp`,
    );
  }

  const fallbackEdge = Math.min(FALLBACK_EDGE, maxEdge);
  await save(
    finish((await load(src, options)).resize(fallbackEdge, fallbackEdge, { fit: 'inside', withoutEnlargement: true }))
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: quality ?? JPEG_QUALITY, mozjpeg: true, progressive: true }),
    `${base}.jpg`,
  );

  return { rel, width: full.width, height: full.height, widths, outputs: outputsFor(base, widths, full.width), skipped: false };
}

async function encodeOg() {
  const src = join(SOURCE_DIR, OG.source);
  const dest = join(OUT_DIR, OG.output);
  const key = `og:${OG.output}`;
  const hash = await inputsHash(src);
  state[key] = hash;
  if (await isFresh(key, hash, [dest])) return { dest, skipped: true };
  await save(
    sharp(src, { failOn: 'none' })
      .rotate()
      .resize(OG.width, OG.height, { fit: 'cover', position: OG.position })
      .jpeg({ quality: OG.quality, mozjpeg: true }),
    dest,
  );
  return { dest, skipped: false };
}

/** Delete generated files whose source is gone, then empty folders. */
async function prune(expected) {
  const removed = [];
  for await (const file of walk(OUT_DIR)) {
    if (!/\.(webp|jpe?g)$/i.test(file) || expected.has(file)) continue;
    await rm(file);
    removed.push(toPosix(relative(OUT_DIR, file)));
  }
  const removeEmptyDirs = async (dir) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) await removeEmptyDirs(join(dir, entry.name));
    }
    if (dir !== OUT_DIR && (await readdir(dir)).length === 0) await rmdir(dir);
  };
  await removeEmptyDirs(OUT_DIR);
  return removed;
}

async function writeManifest(results) {
  const lines = results
    .map((r) => {
      const url = `/images/${r.rel.replace(/\.(jpe?g|png)$/i, '.jpg')}`;
      return `  ${JSON.stringify(url)}: { width: ${r.width}, height: ${r.height}, widths: [${r.widths.join(', ')}] },`;
    })
    .sort();
  const contents = `// Generated by scripts/encode-images.mjs from assets-src/images/. Do not edit by hand.

export interface ImageInfo {
  /** Intrinsic size of the largest variant (<name>.webp). */
  readonly width: number;
  readonly height: number;
  /** Available WebP widths, ascending; the last one is the largest variant. */
  readonly widths: readonly number[];
}

/** Keyed by the image's public JPEG URL, e.g. '/images/arthy.jpg'. */
export const IMAGE_MANIFEST: Readonly<Record<string, ImageInfo>> = {
${lines.join('\n')}
};
`;
  const current = await readFile(MANIFEST_FILE, 'utf8').catch(() => null);
  if (current !== contents) await writeFile(MANIFEST_FILE, contents);
  return current !== contents;
}

await mkdir(OUT_DIR, { recursive: true });
const results = [];
for await (const file of walk(SOURCE_DIR)) {
  if (!SOURCE_EXTS.has(extname(file).toLowerCase())) continue;
  try {
    results.push(await encode(file));
  } catch (err) {
    console.error(`FAILED ${file}:`, err.message);
    process.exitCode = 1;
  }
}
const og = await encodeOg();

if (!process.exitCode) {
  const expected = new Set([og.dest, ...results.flatMap((r) => r.outputs)]);
  const removed = await prune(expected);
  const manifestChanged = await writeManifest(results);
  const stateJson = `${JSON.stringify(Object.fromEntries(Object.entries(state).sort(([a], [b]) => a.localeCompare(b))), null, 2)}\n`;
  if (JSON.stringify(previousState) !== JSON.stringify(JSON.parse(stateJson))) await writeFile(STATE_FILE, stateJson);
  const encoded = results.filter((r) => !r.skipped).length;
  console.log(
    `Images: encoded ${encoded}, up to date ${results.length - encoded}; og-image ${og.skipped ? 'up to date' : 'written'}` +
      `${removed.length ? `; removed stale ${removed.join(', ')}` : ''}; manifest ${manifestChanged ? 'updated' : 'unchanged'}.`,
  );
}
