#!/usr/bin/env node
/** Grid contact sheet + fill stats for studio QA. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { measureBboxFill } from "./lib/studio-image.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const manifest = JSON.parse(
  fs.readFileSync(path.join(ROOT, "content/product-studio-images.json"), "utf8"),
);

const entries = Object.entries(manifest);
const cols = 12;
const cell = 200;
const rows = Math.ceil(entries.length / cols);
const w = cols * cell;
const h = rows * cell;

const composites = [];
const stats = [];

for (let i = 0; i < entries.length; i++) {
  const [webPath, meta] = entries[i];
  const p = path.join(ROOT, "public", meta.default.replace(/^\//, ""));
  if (!fs.existsSync(p)) continue;
  const buf = await fs.promises.readFile(p);
  const { fill } = await measureBboxFill(buf, 480);
  stats.push({
    webPath,
    fill: meta.subjectFill ?? meta.bboxFill ?? fill,
    method: meta.method,
  });

  const col = i % cols;
  const row = Math.floor(i / cols);
  const img = await sharp(p)
    .resize(cell - 8, cell - 8, {
      fit: "contain",
      background: { r: 12, g: 18, b: 24, alpha: 255 },
    })
    .png()
    .toBuffer();
  composites.push({ input: img, left: col * cell + 4, top: row * cell + 4 });
}

const outDir = path.join(ROOT, "docs");
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, "product-studio-qa-contact-sheet.jpg");
await sharp({
  create: { width: w, height: h, channels: 3, background: { r: 12, g: 18, b: 24 } },
})
  .composite(composites)
  .jpeg({ quality: 88 })
  .toFile(out);

const fills = stats.map((s) => s.fill).filter(Number.isFinite);
const summary = {
  count: stats.length,
  fillMin: Math.min(...fills),
  fillMax: Math.max(...fills),
  fillMean: fills.reduce((a, b) => a + b, 0) / fills.length,
  low: stats.filter((s) => s.fill < 0.28),
  high: stats.filter((s) => s.fill > 0.48),
};
fs.writeFileSync(
  path.join(ROOT, "content/photos-qa-stats.json"),
  JSON.stringify({ summary, stats }, null, 2),
);
console.log("wrote", out);
console.log(JSON.stringify(summary, null, 2));