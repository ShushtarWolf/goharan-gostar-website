#!/usr/bin/env node
/** Neutral studio-style placeholder when no HQ photo exists (product #04). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import {
  composeStudioSquare,
  emitStudioVariants,
} from "./lib/studio-image.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(
  ROOT,
  "public/products/placeholders/agricultural-pva-packaging-film.png",
);

const svg = `<svg width="1600" height="1600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="film" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="rgba(160,220,235,0.22)"/>
      <stop offset="100%" stop-color="rgba(60,140,165,0.08)"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1600" fill="transparent"/>
  <ellipse cx="800" cy="1180" rx="280" ry="48" fill="rgba(0,130,165,0.12)"/>
  <rect x="480" y="420" width="640" height="520" rx="36" fill="url(#film)" stroke="rgba(120,200,220,0.35)" stroke-width="4"/>
  <path d="M520 520 h560 M520 620 h460 M520 720 h520" stroke="rgba(0,180,210,0.2)" stroke-width="3" fill="none"/>
  <ellipse cx="800" cy="900" rx="120" ry="36" fill="none" stroke="rgba(0,200,220,0.28)" stroke-width="3"/>
  <text x="800" y="1040" text-anchor="middle" font-family="system-ui,sans-serif" font-size="28" fill="rgba(180,210,220,0.45)">PVA</text>
</svg>`;

async function main() {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const raw = await sharp(Buffer.from(svg)).png().toBuffer();
  const { composed } = await composeStudioSquare(raw);
  await sharp(composed).png().toFile(OUT);

  const outBase = path.join(
    ROOT,
    "public/products/studio/agricultural-pva-placeholder/hero",
  );
  fs.mkdirSync(path.dirname(outBase), { recursive: true });
  const emitted = await emitStudioVariants(
    outBase,
    composed,
    1600,
    path.join(ROOT, "public"),
  );

  const manifestPath = path.join(ROOT, "content/product-studio-images.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const src = "/products/placeholders/agricultural-pva-packaging-film.png";
  manifest[src] = {
    default: emitted.default,
    srcSet: Object.entries(emitted.variants.webp)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([w, p]) => `/${p} ${w}w`)
      .join(", "),
    avifSrcSet: Object.entries(emitted.variants.avif ?? {})
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([w, p]) => `/${p} ${w}w`)
      .join(", "),
    sizes: "(max-width: 640px) 44vw, (max-width: 1024px) 28vw, 320px",
    width: emitted.square,
    height: emitted.square,
    method: "placeholder-graphic",
    source: "scripts/generate-agricultural-placeholder.mjs",
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log("wrote", OUT, emitted.default);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});