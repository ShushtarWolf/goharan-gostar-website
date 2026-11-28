import sharp from "sharp";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/** Fixed square master — product + glow stay well inside; edges are fully transparent. */
export const CANVAS = 1200;
export const PAD = 0.14;
export const FILL_LONG = 0.72;
export const FILL_AREA = 0.36;
export const SIZES = [480, 960, 1200];
export const WEBP_Q = 82;
export const AVIF_Q = 52;
export const PIPELINE_VERSION = "edge-vignette-v2";

const REMBG = process.env.REMBG_BIN ?? `${process.env.HOME}/.local/bin/rembg`;
const REMBG_MODEL = process.env.REMBG_MODEL ?? "isnet-general-use";

export function rembgCutout(inputPath, outPngPath, model = REMBG_MODEL) {
  fs.mkdirSync(pathDir(outPngPath), { recursive: true });
  const r = spawnSync(
    REMBG,
    ["i", inputPath, outPngPath, "-m", model],
    { encoding: "utf8", timeout: 300_000 },
  );
  if (r.status !== 0 || !fs.existsSync(outPngPath)) {
    throw new Error(r.stderr || r.stdout || "rembg failed");
  }
}

function pathDir(p) {
  return p.replace(/\/[^/]+$/, "");
}

/** Heuristic QA — bad cutout → feather fallback */
export async function assessCutout(pngPath) {
  const { data, info } = await sharp(pngPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  let opaque = 0;
  let minX = w;
  let minY = h;
  let maxX = 0;
  let maxY = 0;
  let cornerOpaque = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const a = data[i + 3];
      if (a > 128) {
        opaque++;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
      if ((y < 4 || y >= h - 4) && (x < 4 || x >= w - 4) && a > 32) {
        cornerOpaque++;
      }
    }
  }

  const bboxArea = Math.max(0, maxX - minX) * Math.max(0, maxY - minY);
  const ratio = opaque / (w * h);
  const bboxRatio = bboxArea / (w * h);
  const marginX = Math.min(minX, w - 1 - maxX) / w;
  const marginY = Math.min(minY, h - 1 - maxY) / h;

  const bad =
    ratio < 0.04 ||
    bboxRatio < 0.06 ||
    (marginX < 0.01 && marginY < 0.01 && bboxRatio > 0.92) ||
    cornerOpaque > 60;

  return { bad, ratio, bboxRatio, marginX, marginY, cornerOpaque };
}

/** Multiply alpha by elliptical ramp so corners/edges are fully transparent (no square frame). */
export async function applyCanvasAlphaVignette(rgbaBuffer, size = CANVAS) {
  const { data, info } = await sharp(rgbaBuffer)
    .ensureAlpha()
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const cx = w / 2;
  const cy = h * 0.47;
  const rx = w * 0.34;
  const ry = h * 0.34;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      const d = Math.sqrt(dx * dx + dy * dy);
      let m = 1;
      if (d > 0.78) m = Math.max(0, 1 - (d - 0.78) / 0.24);
      const i = (y * w + x) * 4;
      data[i + 3] = Math.round(data[i + 3] * m);
      if (data[i + 3] < 6) data[i + 3] = 0;
    }
  }

  return sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toBuffer();
}

/** Radial feather — alpha → 0 before image edges (no hard square). */
export async function featherFallback(inputPath) {
  const meta = await sharp(inputPath).metadata();
  const w = meta.width ?? 512;
  const h = meta.height ?? 512;

  const maskSvg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="g" cx="50%" cy="46%" rx="38%" ry="36%" gradientUnits="objectBoundingBox">
        <stop offset="0%" stop-color="white"/>
        <stop offset="72%" stop-color="white"/>
        <stop offset="92%" stop-color="rgba(255,255,255,0.15)"/>
        <stop offset="100%" stop-color="black"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
  </svg>`;

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const mask = await sharp(Buffer.from(maskSvg))
    .resize(w, h)
    .greyscale()
    .raw()
    .toBuffer();

  for (let i = 0; i < w * h; i++) {
    const mi = mask[i] / 255;
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const lum = (r + g + b) / 3;
    const bg = lum > 248 ? 0 : lum > 218 ? (248 - lum) / 30 : 1;
    data[i * 4 + 3] = Math.round(data[i * 4 + 3] * mi * mi * bg);
    if (data[i * 4 + 3] < 6) data[i * 4 + 3] = 0;
  }

  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).png();
}

/** Soft radial glow under product — fades to 0 long before canvas edge. */
async function groundGlowLayer(canvasSize, cx, baselineY) {
  const spread = Math.round(canvasSize * 0.22);
  const svg = `<svg width="${canvasSize}" height="${canvasSize}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="glow" cx="${cx}" cy="${baselineY}" r="${spread}" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="rgba(0,175,205,0.22)"/>
        <stop offset="45%" stop-color="rgba(0,130,160,0.06)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#glow)"/>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

function subjectScale(sw, sh) {
  const inner = CANVAS * (1 - 2 * PAD);
  const long = Math.max(sw, sh);
  const area = sw * sh;
  const byLong = (FILL_LONG * CANVAS) / long;
  const byArea = Math.sqrt((FILL_AREA * CANVAS * CANVAS) / Math.max(area, 1));
  const scale = Math.min(byLong, byArea, inner / sw, inner / sh);
  return Math.max(0.05, scale);
}

/** Trim cutout, uniform fill, ground glow, full transparent canvas with edge vignette. */
export async function composeStudioSquare(rgbaInput) {
  const trimmedBuf = await sharp(rgbaInput).trim().png().toBuffer();
  const meta = await sharp(trimmedBuf).metadata();
  const sw = meta.width ?? 1;
  const sh = meta.height ?? 1;

  const scale = subjectScale(sw, sh);
  const nw = Math.max(1, Math.round(sw * scale));
  const nh = Math.max(1, Math.round(sh * scale));

  const subject = await sharp(trimmedBuf).resize(nw, nh).png().toBuffer();
  const left = Math.round((CANVAS - nw) / 2);
  const baseline = Math.round(CANVAS * 0.8);
  const top = Math.max(Math.round(CANVAS * PAD), baseline - nh);
  const cx = left + Math.round(nw / 2);

  const glow = await groundGlowLayer(CANVAS, cx, baseline + 8);

  let composed = await sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: glow, left: 0, top: 0, blend: "over" },
      { input: subject, left, top, blend: "over" },
    ])
    .png()
    .toBuffer();

  composed = await applyCanvasAlphaVignette(composed, CANVAS);
  return { composed, canvasSize: CANVAS };
}

export function buildSrcSet(variants, format) {
  const bag = variants[format] ?? {};
  return Object.entries(bag)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([w, p]) => `/${p} ${w}w`)
    .join(", ");
}

export async function emitStudioVariants(
  outBase,
  masterPngBuffer,
  _squareEdge,
  publicRoot,
) {
  const variants = { webp: {}, avif: {} };
  const maxEdge = CANVAS;

  for (const edge of SIZES) {
    if (edge > maxEdge + 2) continue;
    const target = Math.min(edge, maxEdge);
    const webpOut = `${outBase}-${target}.webp`;
    const avifOut = `${outBase}-${target}.avif`;

    const resized = await sharp(masterPngBuffer)
      .resize(target, target, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    const vignetted = await applyCanvasAlphaVignette(resized, target);

    await sharp(vignetted)
      .webp({ quality: WEBP_Q, alphaQuality: 92, effort: 4 })
      .toFile(webpOut);

    const rel = path.relative(publicRoot, webpOut).split(path.sep).join("/");
    variants.webp[target] = rel;

    try {
      await sharp(vignetted).avif({ quality: AVIF_Q }).toFile(avifOut);
      variants.avif[target] = path.relative(publicRoot, avifOut).split(path.sep).join("/");
    } catch {
      /* optional */
    }
  }

  const keys = Object.keys(variants.webp).map(Number).sort((a, b) => a - b);
  const pick = keys.includes(960) ? 960 : keys[keys.length - 1];

  return {
    variants,
    default: `/${variants.webp[pick]}`,
    square: pick,
    largestVariant: Math.max(...keys, 0),
  };
}