#!/usr/bin/env node
/**
 * Background removal + normalized square studio assets for all product images.
 * Writes content/product-studio-images.json
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import {
  assessCutout,
  buildSrcSet,
  composeStudioSquare,
  emitStudioVariants,
  featherFallback,
  rembgCutout,
} from "./lib/studio-image.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const HQ_SRC =
  process.env.HQ_PHOTO_SRC ?? "/cursor/stores/self/goharan-photos/hq";
const STUDIO_DIR = path.join(ROOT, "public/products/studio");
const CACHE_DIR = path.join(ROOT, ".cache/photos-cutout");
const MANIFEST_PATH = path.join(ROOT, "content/product-studio-images.json");
const REPORT_PATH = path.join(ROOT, "content/photos-cutout-report.json");

const LIMIT = process.env.PHOTOS_CUTOUT_LIMIT
  ? Number(process.env.PHOTOS_CUTOUT_LIMIT)
  : 0;

function collectProductPaths() {
  const json = execSync("npx tsx scripts/collect-product-images.ts", {
    cwd: ROOT,
    encoding: "utf8",
    env: { ...process.env, NODE_OPTIONS: "" },
  });
  return JSON.parse(json);
}

function resolveHqOriginal(webPath) {
  if (!webPath.startsWith("/products/hq/")) return null;
  const stem = webPath
    .replace(/^\/products\/hq\//, "")
    .replace(/-\d+\.webp$/i, "");
  const idx = stem.indexOf("--");
  if (idx < 0) return null;
  const suffix = stem.slice(idx + 2);
  for (const ext of [".jpg", ".jpeg", ".png", ".webp"]) {
    const direct = path.join(HQ_SRC, suffix + ext);
    if (fs.existsSync(direct)) return direct;
    const numbered = fs
      .readdirSync(HQ_SRC)
      .find((f) => f.replace(/\.[^.]+$/, "") === suffix || f.includes(suffix));
    if (numbered) return path.join(HQ_SRC, numbered);
  }
  return null;
}

function resolveSourcePath(webPath) {
  const hq = resolveHqOriginal(webPath);
  if (hq) return hq;
  const local = path.join(ROOT, "public", webPath.replace(/^\//, ""));
  if (fs.existsSync(local)) return local;
  return null;
}

function sourceId(absPath) {
  return crypto.createHash("sha1").update(absPath).digest("hex").slice(0, 12);
}

async function cutoutPipeline(absSource, cachePng) {
  fs.mkdirSync(path.dirname(cachePng), { recursive: true });
  const tmpCut = cachePng.replace(/\.png$/, ".rembg.png");

  let method = "rembg";
  try {
    rembgCutout(absSource, tmpCut);
    const qa = await assessCutout(tmpCut);
    if (qa.bad) {
      method = "feather-fallback";
      const fb = await featherFallback(absSource);
      await fb.png().toFile(cachePng);
    } else {
      fs.copyFileSync(tmpCut, cachePng);
    }
  } catch {
    method = "feather-fallback";
    const fb = await featherFallback(absSource);
    await fb.png().toFile(cachePng);
  }

  if (fs.existsSync(tmpCut)) fs.unlinkSync(tmpCut);
  return method;
}

async function processOne(webPath, report, bySource) {
  const absSource = resolveSourcePath(webPath);
  if (!absSource) {
    report.missingSource.push(webPath);
    return;
  }

  const id = sourceId(absSource);
  if (bySource.has(id)) {
    const prev = bySource.get(id);
    report.reused.push({ webPath, source: absSource, from: prev.webPath });
    if (!report.manifest[webPath]) {
      report.manifest[webPath] = { ...prev.entry };
    }
    return;
  }

  const cachePng = path.join(CACHE_DIR, `${id}.png`);
  const srcStat = fs.statSync(absSource);
  const stamp = `${srcStat.mtimeMs}-${srcStat.size}`;
  const stampFile = path.join(CACHE_DIR, `${id}.stamp`);
  const methodFile = path.join(CACHE_DIR, `${id}.method`);
  let method = "cached";

  if (
    !fs.existsSync(cachePng) ||
    !fs.existsSync(stampFile) ||
    fs.readFileSync(stampFile, "utf8") !== stamp
  ) {
    method = await cutoutPipeline(absSource, cachePng);
    fs.writeFileSync(stampFile, stamp);
    fs.writeFileSync(methodFile, method);
  } else if (fs.existsSync(methodFile)) {
    method = fs.readFileSync(methodFile, "utf8").trim();
  }

  const { composed } = await composeStudioSquare(cachePng);
  const meta = await import("sharp").then((m) =>
    m.default(composed).metadata(),
  );
  const sourceLong = Math.max(meta.width ?? 1600, meta.height ?? 1600);

  const outBase = path.join(STUDIO_DIR, id, "hero");
  fs.mkdirSync(path.dirname(outBase), { recursive: true });

  const emitted = await emitStudioVariants(
    outBase,
    composed,
    Math.min(1600, sourceLong),
    path.join(ROOT, "public"),
  );

  if (!emitted.default) {
    report.failed.push({ webPath, source: absSource, reason: "no variants" });
    return;
  }

  const entry = {
    default: emitted.default,
    srcSet: buildSrcSet(emitted.variants, "webp"),
    avifSrcSet: buildSrcSet(emitted.variants, "avif") || undefined,
    sizes: "(max-width: 640px) 44vw, (max-width: 1024px) 28vw, 320px",
    width: emitted.square,
    height: emitted.square,
    method,
    source: path.relative(ROOT, absSource),
  };

  report.manifest[webPath] = entry;
  bySource.set(id, { webPath, entry });
  if (method === "feather-fallback") {
    report.fallbackFeather.push({ webPath, source: absSource });
  } else if (method === "rembg") {
    report.rembgOk.push(webPath);
  }
}

async function main() {
  fs.mkdirSync(STUDIO_DIR, { recursive: true });
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  let prior = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      prior = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
    } catch {
      prior = {};
    }
  }

  const paths = collectProductPaths();
  const work = LIMIT > 0 ? paths.slice(0, LIMIT) : paths;

  const report = {
    prior,
    manifest: {},
    rembgOk: [],
    fallbackFeather: [],
    missingSource: [],
    failed: [],
    reused: [],
    processed: work.length,
    total: paths.length,
  };

  const bySource = new Map();

  for (let i = 0; i < work.length; i++) {
    const webPath = work[i];
    process.stdout.write(`[${i + 1}/${work.length}] ${webPath}\n`);
    await processOne(webPath, report, bySource);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(report.manifest, null, 2));
  fs.writeFileSync(
    REPORT_PATH,
    JSON.stringify(
      {
        processed: report.processed,
        total: report.total,
        rembgOk: report.rembgOk.length,
        fallbackFeather: report.fallbackFeather,
        missingSource: report.missingSource,
        failed: report.failed,
        reused: report.reused.length,
      },
      null,
      2,
    ),
  );

  console.log(
    JSON.stringify(
      {
        studio: Object.keys(report.manifest).length,
        rembg: report.rembgOk.length,
        feather: report.fallbackFeather.length,
        missing: report.missingSource.length,
        failed: report.failed.length,
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