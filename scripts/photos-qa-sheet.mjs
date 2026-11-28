#!/usr/bin/env node
/** Grid contact sheet of studio defaults for visual QA. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const manifest = JSON.parse(
  fs.readFileSync(path.join(ROOT, "content/product-studio-images.json"), "utf8"),
);
const cols = 12;
const cell = 200;
const paths = Object.values(manifest).map((e) => e.default).filter(Boolean);
const rows = Math.ceil(paths.length / cols);
const w = cols * cell;
const h = rows * cell;

const composites = [];
for (let i = 0; i < paths.length; i++) {
  const p = path.join(ROOT, "public", paths[i].replace(/^\//, ""));
  if (!fs.existsSync(p)) continue;
  const col = i % cols;
  const row = Math.floor(i / cols);
  const img = await sharp(p).resize(cell - 8, cell - 8, {
    fit: "contain",
    background: { r: 12, g: 18, b: 24, alpha: 255 },
  }).png().toBuffer();
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
console.log("wrote", out, paths.length, "tiles");