#!/usr/bin/env node
/**
 * Background removal + normalized square studio assets for all product images.
 *
 * Prereq: pip install "rembg[cpu,cli]" onnxruntime torch torchvision realesrgan basicsr
 *         export PATH="$HOME/.local/bin:$PATH"
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { upscaleSourceIfNeeded } from "./lib/esrgan.mjs";
import {
  assessCutout,
  buildSrcSet,
  CANVAS,
  composeStudioSquare,
  emitStudioVariants,
  featherFallback,
  PIPELINE_VERSION,
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

function loadPriorFeatherPaths() {
  const p = path.join(ROOT, "content/photos-cutout-report.json");
  if (!fs.existsSync(p)) return new Set();
  try {
    const j = JSON.parse(fs.readFileSync(p, "utf8"));
    return new Set((j.fallbackFeather ?? []).map((x) => x.webPath));
  } catch {
    return new Set();
  }
}

const PRIOR_FEATHER = loadPriorFeatherPaths();

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

async function cutoutPipeline(absSource, cachePng, id, webPath) {
  fs.mkdirSync(path.dirname(cachePng), { recursive: true });
  const tmpCut = cachePng.replace(/\.png$/, ".rembg.png");
  const prepDir = path.join(CACHE_DIR, "prep", id);

  const up = await upscaleSourceIfNeeded(absSource, prepDir);
  const workSource = up.path;

  const models =
    PRIOR_FEATHER.has(webPath) || process.env.FORCE_BIREFNET === "1"
      ? ["birefnet-general", "isnet-general-use"]
      : ["isnet-general-use", "birefnet-general"];

  for (const model of models) {
    try {
      rembgCutout(workSource, tmpCut, model);
      const qa = await assessCutout(tmpCut);
      const featherRetry =
        PRIOR_FEATHER.has(webPath) &&
        qa.bboxRatio >= 0.07 &&
        qa.ratio >= 0.045 &&
        qa.cornerOpaque < 120;
      if (!qa.bad || featherRetry) {
        fs.copyFileSync(tmpCut, cachePng);
        if (fs.existsSync(tmpCut)) fs.unlinkSync(tmpCut);
        return { method: `rembg-${model}`, upscale: up.method ?? "none" };
      }
    } catch {
      /* try next */
    }
  }

  if (fs.existsSync(tmpCut)) fs.unlinkSync(tmpCut);
  const fb = await featherFallback(workSource);
  await fb.png().toFile(cachePng);
  return { method: "feather-fallback", upscale: up.method ?? "none" };
}

async function composeWithOutlierFix(cachePng) {
  const TARGET_SUBJECT_FILL = 0.34;
  const lowBoosts = [1, 1.12, 1.24, 1.36, 1.5, 1.68, 1.88];
  let result = await composeStudioSquare(cachePng);
  const metric = () => result.subjectFill ?? result.fill;
  if (metric() < TARGET_SUBJECT_FILL * 0.82) {
    for (const fillBoost of lowBoosts) {
      result = await composeStudioSquare(cachePng, { fillBoost });
      if (metric() >= TARGET_SUBJECT_FILL * 0.82) break;
    }
  } else if (metric() > TARGET_SUBJECT_FILL * 1.35) {
    for (const fillBoost of [0.92, 0.86, 0.8]) {
      result = await composeStudioSquare(cachePng, { fillBoost });
      if (metric() <= TARGET_SUBJECT_FILL * 1.35) break;
    }
  }
  return result;
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
    report.manifest[webPath] = { ...prev.entry };
    return;
  }

  const cachePng = path.join(CACHE_DIR, `${id}.png`);
  const srcStat = fs.statSync(absSource);
  const stamp = `${srcStat.mtimeMs}-${srcStat.size}-${PIPELINE_VERSION}`;
  const stampFile = path.join(CACHE_DIR, `${id}.stamp`);
  const methodFile = path.join(CACHE_DIR, `${id}.method`);
  let method = "cached";
  let upscale = "none";

  if (
    !fs.existsSync(cachePng) ||
    !fs.existsSync(stampFile) ||
    fs.readFileSync(stampFile, "utf8") !== stamp
  ) {
    const r = await cutoutPipeline(absSource, cachePng, id, webPath);
    method = r.method;
    upscale = r.upscale;
    fs.writeFileSync(stampFile, stamp);
    fs.writeFileSync(methodFile, method);
  } else if (fs.existsSync(methodFile)) {
    method = fs.readFileSync(methodFile, "utf8").trim();
  }

  const { composed, fill, subjectFill } = await composeWithOutlierFix(cachePng);

  const outBase = path.join(STUDIO_DIR, id, "hero");
  fs.mkdirSync(path.dirname(outBase), { recursive: true });

  fs.writeFileSync(
    path.join(CACHE_DIR, `${id}.pipeline`),
    PIPELINE_VERSION,
  );

  const emitted = await emitStudioVariants(
    outBase,
    composed,
    CANVAS,
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
    upscale,
    bboxFill: Math.round(fill * 1000) / 1000,
    subjectFill: Math.round((subjectFill ?? fill) * 1000) / 1000,
    source: path.relative(ROOT, absSource),
  };

  report.manifest[webPath] = entry;
  bySource.set(id, { webPath, entry });

  if (method === "feather-fallback") {
    report.fallbackFeather.push({ webPath, source: absSource });
  } else if (method.startsWith("rembg")) {
    report.rembgOk.push(webPath);
  }

  const sf = subjectFill ?? fill;
  if (sf < 0.26 || sf > 0.52) {
    report.outliers.push({ webPath, fill: sf, method });
  }
}

async function main() {
  fs.mkdirSync(STUDIO_DIR, { recursive: true });
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  const paths = collectProductPaths();
  const work = LIMIT > 0 ? paths.slice(0, LIMIT) : paths;

  const report = {
    pipeline: PIPELINE_VERSION,
    manifest: {},
    rembgOk: [],
    fallbackFeather: [],
    outliers: [],
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
        pipeline: report.pipeline,
        processed: report.processed,
        total: report.total,
        rembgOk: report.rembgOk.length,
        fallbackFeather: report.fallbackFeather,
        outliers: report.outliers,
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
        pipeline: PIPELINE_VERSION,
        studio: Object.keys(report.manifest).length,
        rembg: report.rembgOk.length,
        feather: report.fallbackFeather.length,
        outliers: report.outliers.length,
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