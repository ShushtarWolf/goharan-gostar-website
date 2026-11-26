/**
 * Extract catalog WebP images from the official PDF and regenerate content/catalog.json
 * via scripts/catalog-work/generate-catalog.py (curated rows, no prices).
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const PDF =
  process.env.CATALOG_PDF ??
  path.join(
    process.env.HOME ?? "",
    ".cursor/projects/workspace/uploads/5bfe19296f699330234404d24ea71ed89968c06eb59947440abb6a8335b4dff6_7d3c.pdf",
  );
const work = path.join(ROOT, "scripts/catalog-work");

export function extractImages() {
  fs.mkdirSync(work, { recursive: true });
  const outDir = path.join(ROOT, "public/catalog");
  fs.mkdirSync(outDir, { recursive: true });
  execSync(`pdfimages -all "${PDF}" "${path.join(work, "img")}"`, {
    stdio: "inherit",
  });
  const files = fs
    .readdirSync(work)
    .filter((f) => /^img-\d+\.(jpg|jpeg|ppm|png)$/i.test(f))
    .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));

  let idx = 0;
  for (const f of files) {
    if (/img-000\./.test(f)) continue;
    const src = path.join(work, f);
    if (fs.statSync(src).size < 2500) continue;
    const out = path.join(outDir, `catalog-${String(idx).padStart(3, "0")}.webp`);
    execSync(`cwebp -q 86 "${src}" -o "${out}"`, { stdio: "pipe" });
    idx++;
  }
  return idx;
}

function main() {
  extractImages();
  execSync("python3 scripts/catalog-work/generate-catalog.py", {
    cwd: ROOT,
    stdio: "inherit",
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}