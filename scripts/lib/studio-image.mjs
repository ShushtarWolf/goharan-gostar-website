import sharp from "sharp";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export const CANVAS = 1600;
export const PAD = 0.11;
export const SIZES = [480, 960, 1600];
export const WEBP_Q = 82;
export const AVIF_Q = 52;

const REMBG = process.env.REMBG_BIN ?? `${process.env.HOME}/.local/bin/rembg`;
const REMBG_MODEL = process.env.REMBG_MODEL ?? "isnet-general-use";

export function rembgCutout(inputPath, outPngPath) {
  fs.mkdirSync(pathDir(outPngPath), { recursive: true });
  const r = spawnSync(
    REMBG,
    ["i", inputPath, outPngPath, "-m", REMBG_MODEL],
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
      if ((y < 3 || y >= h - 3) && (x < 3 || x >= w - 3) && a > 64) {
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
    cornerOpaque > 80;

  return { bad, ratio, bboxRatio, marginX, marginY };
}

/** Radial feather + light background key when rembg fails QA */
export async function featherFallback(inputPath) {
  const meta = await sharp(inputPath).metadata();
  const w = meta.width ?? 512;
  const h = meta.height ?? 512;

  const maskSvg = `<svg width="${w}" height="${h}">
    <defs>
      <radialGradient id="g" cx="50%" cy="46%" rx="46%" ry="44%">
        <stop offset="52%" stop-color="white"/>
        <stop offset="100%" stop-color="black"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
  </svg>`;

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const mask = await sharp(Buffer.from(maskSvg)).resize(w, h).greyscale().raw().toBuffer();

  for (let i = 0; i < w * h; i++) {
    const mi = mask[i] / 255;
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const lum = (r + g + b) / 3;
    const bg = lum > 248 ? 0 : lum > 218 ? (248 - lum) / 30 : 1;
    data[i * 4 + 3] = Math.round(data[i * 4 + 3] * mi * bg);
  }

  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).png();
}

async function subjectShadowBuffer(subjectPng, w, h) {
  const alpha = await sharp(subjectPng).ensureAlpha().extractChannel(3).blur(22).toBuffer();
  const colored = await sharp({
    create: { width: w, height: h, channels: 3, background: { r: 12, g: 110, b: 135 } },
  })
    .joinChannel(alpha)
    .png()
    .toBuffer();
  return colored;
}

/** Trim cutout, center on square canvas with padding + cyan glass shadow */
export async function composeStudioSquare(rgbaInput) {
  const trimmedBuf = await sharp(rgbaInput).trim().png().toBuffer();
  const trimmed = sharp(trimmedBuf);
  const meta = await trimmed.metadata();
  const sw = meta.width ?? 1;
  const sh = meta.height ?? 1;
  const sourceLong = Math.max(sw, sh);

  const canvasSize = Math.min(CANVAS, Math.max(480, sourceLong));
  const inner = Math.round(canvasSize * (1 - 2 * PAD));
  const scale = Math.min(inner / sw, inner / sh, 1);
  const nw = Math.max(1, Math.round(sw * scale));
  const nh = Math.max(1, Math.round(sh * scale));

  const subject = await sharp(trimmedBuf).resize(nw, nh).png().toBuffer();
  const shadow = await subjectShadowBuffer(subject, nw, nh);
  const left = Math.round((canvasSize - nw) / 2);
  const top = Math.round((canvasSize - nh) / 2);
  const shadowTop = top + Math.round(nh * 0.06);

  const composed = await sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: shadow, left: left - 6, top: shadowTop, blend: "over" },
      { input: subject, left, top, blend: "over" },
    ])
    .png()
    .toBuffer();

  return { composed, canvasSize };
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
  squareEdge,
  publicRoot,
) {
  const variants = { webp: {}, avif: {} };
  const maxEdge = Math.min(CANVAS, squareEdge);

  for (const edge of SIZES) {
    if (edge > maxEdge + 2) continue;
    const target = Math.min(edge, maxEdge);
    const webpOut = `${outBase}-${target}.webp`;
    const avifOut = `${outBase}-${target}.avif`;

    await sharp(masterPngBuffer)
      .resize(target, target, { fit: "cover", withoutEnlargement: true })
      .webp({ quality: WEBP_Q, alphaQuality: 90 })
      .toFile(webpOut);

    const rel = path.relative(publicRoot, webpOut).split(path.sep).join("/");
    variants.webp[target] = rel;

    try {
      await sharp(masterPngBuffer)
        .resize(target, target, { fit: "cover", withoutEnlargement: true })
        .avif({ quality: AVIF_Q })
        .toFile(avifOut);
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