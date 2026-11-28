#!/usr/bin/env node
/**
 * Ingest HQ product photos from agent store → public/products/hq/
 * Writes content/product-hq-images.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const HQ_SRC =
  process.env.HQ_PHOTO_SRC ??
  "/cursor/stores/self/goharan-photos/hq";
const XLSX =
  process.env.HQ_XLSX ??
  "/cursor/stores/self/goharan-photos/hq-sources.xlsx";
const SIZES = [480, 960, 1600];
const WEBP_Q = 80;
const AVIF_Q = 50;

const slugMap = JSON.parse(
  fs.readFileSync(path.join(ROOT, "content/hq-photo-slug-map.json"), "utf8"),
);

function loadCatalogImages() {
  const catalog = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content/catalog.json"), "utf8"),
  );
  const bySlug = new Map();
  for (const p of catalog.products ?? []) {
    if (p.image) bySlug.set(p.slug, p.image);
  }
  return bySlug;
}

function loadXlsxRows() {
  try {
    const XLSXLib = require("xlsx");
    const wb = XLSXLib.readFile(XLSX);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSXLib.utils.sheet_to_json(sheet, { defval: "" });
    return rows;
  } catch (e) {
    console.warn("xlsx read failed, metadata from filenames only:", e.message);
    return [];
  }
}

function parseMapEntry(entry) {
  if (entry == null) return null;
  if (typeof entry === "string") return { slug: entry, role: "primary" };
  return entry;
}

async function longEdge(filePath) {
  try {
    const meta = await sharp(filePath).metadata();
    return Math.max(meta.width ?? 0, meta.height ?? 0);
  } catch {
    return 0;
  }
}

async function existingPrimaryLongEdge(rel) {
  if (!rel) return 0;
  const p = path.join(ROOT, "public", rel.replace(/^\//, ""));
  if (!fs.existsSync(p)) return 0;
  return longEdge(p);
}

function placeholderFromRow(row) {
  const cls = licenseClassFromRow(row);
  if (
    cls.includes("copyrighted") ||
    cls.includes("حق‌نشر سازنده") ||
    (cls.includes("حق‌نشر") && !cls.includes("رسمی") && !cls.includes("آزاد"))
  ) {
    return true;
  }
  return false;
}

function creditFromRow(row) {
  const cls = licenseClassFromRow(row);
  if (cls.includes("رسمی") || cls.toLowerCase().includes("official")) return null;
  if (!cls.includes("آزاد") && !cls.toLowerCase().includes("free")) return null;

  const license = String(
    row.license ?? row["مجوز / حق‌نشر"] ?? row["مجوز"] ?? "",
  ).trim();
  const url = String(
    row["image URL"] ?? row["آدرس فایل تصویر"] ?? row["آدرس تصویر"] ?? "",
  ).trim();
  if (!license && !url.includes("wikimedia")) return null;

  let en = license;
  if (url.includes("wikimedia") && license) en = license;
  else if (url.includes("wikimedia")) en = "Wikimedia Commons — CC license";
  if (!en) return null;
  return { fa: en, en, tr: en };
}

function rowForFile(rows, file) {
  const base = file.replace(/\.[^.]+$/, "");
  for (const r of rows) {
    const f = String(r.file ?? r["فایل"] ?? "");
    if (f === file || f.replace(/\.[^.]+$/, "") === base) return r;
  }
  return {};
}

function licenseClassFromRow(row) {
  return String(row["license class"] ?? row["دستهٔ مجوز"] ?? row["کلاس مجوز"] ?? "");
}

async function emitVariants(outBase, sourcePath, sourceLong) {
  const variants = { webp: {}, avif: {} };
  const meta = await sharp(sourcePath).metadata();
  const sw = meta.width ?? 0;
  const sh = meta.height ?? 0;

  for (const edge of SIZES) {
    if (sourceLong < edge * 0.85 && edge > sourceLong) continue;
    const target = Math.min(edge, sourceLong);
    const webpOut = `${outBase}-${target}.webp`;
    const avifOut = `${outBase}-${target}.avif`;
    await sharp(sourcePath)
      .resize({
        width: sw >= sh ? target : undefined,
        height: sh > sw ? target : undefined,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_Q })
      .toFile(webpOut);
    variants.webp[target] = path
      .relative(path.join(ROOT, "public"), webpOut)
      .split(path.sep)
      .join("/");

    try {
      await sharp(sourcePath)
        .resize({
          width: sw >= sh ? target : undefined,
          height: sh > sw ? target : undefined,
          fit: "inside",
          withoutEnlargement: true,
        })
        .avif({ quality: AVIF_Q })
        .toFile(avifOut);
      variants.avif[target] = path
        .relative(path.join(ROOT, "public"), avifOut)
        .split(path.sep)
        .join("/");
    } catch {
      /* avif optional */
    }
  }

  const keys = Object.keys(variants.webp)
    .map(Number)
    .sort((a, b) => a - b);
  const pick = keys.includes(960) ? 960 : keys[keys.length - 1];
  const defaultPath = variants.webp[pick];

  return {
    variants,
    defaultPath: `/${variants.webp[pick]}`,
    width: sw,
    height: sh,
    sourceLong,
    largestVariant: Math.max(...keys, 0),
  };
}

function buildSrcSet(variants, format) {
  const bag = variants[format] ?? {};
  return Object.entries(bag)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([w, p]) => `/${p} ${w}w`)
    .join(", ");
}

async function main() {
  if (!fs.existsSync(HQ_SRC)) {
    console.error("HQ source missing:", HQ_SRC);
    process.exit(1);
  }

  const catalogBySlug = loadCatalogImages();
  const rows = loadXlsxRows();
  const outDir = path.join(ROOT, "public/products/hq");
  fs.mkdirSync(outDir, { recursive: true });

  const manifest = {};
  const report = { applied: [], skipped: [], unmatched: [] };
  const files = fs.readdirSync(HQ_SRC).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

  for (const file of files.sort()) {
    const base = file.replace(/\.[^.]+$/, "");
    const mapKey = base;
    const mapped = parseMapEntry(slugMap[mapKey] ?? slugMap[base.replace(/^\d+-/, "")]);
    if (!mapped) {
      report.unmatched.push(file);
      continue;
    }

    const { slug, role } = mapped;
    const srcPath = path.join(HQ_SRC, file);
    const row = rowForFile(rows, file);
    const sourceLong = await longEdge(srcPath);
    const catalogImg = catalogBySlug.get(slug);
    const existingLong = await existingPrimaryLongEdge(catalogImg);

    const licenseCls = licenseClassFromRow(row);
    const isOfficial =
      licenseCls.includes("رسمی") || licenseCls.toLowerCase().includes("official");

    if (role === "primary") {
      if (existingLong > sourceLong + 80 && isOfficial) {
        report.skipped.push({
          file,
          slug,
          reason: `existing longer (${existingLong} > ${sourceLong})`,
        });
        continue;
      }
      if (existingLong > sourceLong + 200 && !isOfficial) {
        report.skipped.push({
          file,
          slug,
          reason: `existing much longer (${existingLong} > ${sourceLong})`,
        });
        continue;
      }
    }

    const outBase = path.join(outDir, `${slug}--${base}`);
    const emitted = await emitVariants(outBase, srcPath, sourceLong);
    if (!emitted.defaultPath) {
      report.skipped.push({ file, slug, reason: "no variants" });
      continue;
    }

    const entry = {
      slug,
      role,
      sourceFile: file,
      width: emitted.width,
      height: emitted.height,
      default: emitted.defaultPath,
      srcSet: buildSrcSet(emitted.variants, "webp"),
      avifSrcSet: buildSrcSet(emitted.variants, "avif") || undefined,
      sizes: "(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 520px",
      credit: creditFromRow(row),
      placeholder: placeholderFromRow(row),
      licenseClass: licenseCls,
    };

    if (!manifest[slug]) manifest[slug] = { primary: null, gallery: [] };
    if (role === "primary") {
      if (!manifest[slug].primary || emitted.largestVariant >= (manifest[slug].primary?.largestVariant ?? 0)) {
        manifest[slug].primary = { ...entry, largestVariant: emitted.largestVariant };
      }
    } else {
      manifest[slug].gallery.push(entry);
    }
    report.applied.push({ file, slug, role, default: entry.default });
  }

  const outJson = path.join(ROOT, "content/product-hq-images.json");
  fs.writeFileSync(outJson, JSON.stringify(manifest, null, 2));
  fs.writeFileSync(
    path.join(ROOT, "content/hq-ingest-report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(
    JSON.stringify(
      {
        applied: report.applied.length,
        skipped: report.skipped.length,
        unmatched: report.unmatched.length,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});