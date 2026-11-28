import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const NCNN_BIN =
  process.env.REALESRGAN_BIN ??
  "/tmp/realesrgan-ncnn/realesrgan-ncnn-vulkan-20220424-ubuntu/realesrgan-ncnn-vulkan";

const MIN_SOURCE_LONG = Number(process.env.STUDIO_MIN_SOURCE_LONG ?? 800);
const UPSCALE_TARGET = Number(process.env.STUDIO_UPSCALE_TARGET ?? 1200);

export async function sourceLongEdge(absPath) {
  const meta = await sharp(absPath).metadata();
  return Math.max(meta.width ?? 0, meta.height ?? 0);
}

/** Upscale low-res sources before cutout (Real-ESRGAN x4, else Lanczos + sharpen). */
export async function upscaleSourceIfNeeded(absPath, workDir) {
  const long = await sourceLongEdge(absPath);
  if (long >= MIN_SOURCE_LONG) return { path: absPath, upscaled: false };

  fs.mkdirSync(workDir, { recursive: true });
  const base = path.basename(absPath, path.extname(absPath));
  const prepIn = path.join(workDir, `${base}-prep-in.png`);
  const prepOut = path.join(workDir, `${base}-esrgan.png`);

  await sharp(absPath).png().toFile(prepIn);

  if (fs.existsSync(NCNN_BIN)) {
    const r = spawnSync(
      NCNN_BIN,
      ["-i", prepIn, "-o", prepOut, "-s", "4", "-n", "realesrgan-x4plus"],
      { encoding: "utf8", timeout: 300_000 },
    );
    if (r.status === 0 && fs.existsSync(prepOut)) {
      const upLong = await sourceLongEdge(prepOut);
      return { path: prepOut, upscaled: true, method: "realesrgan-ncnn", upLong };
    }
  }

  const factor = Math.min(4, Math.ceil(UPSCALE_TARGET / Math.max(long, 1)));
  await sharp(absPath)
    .resize({
      width: Math.round((await sharp(absPath).metadata()).width * factor),
      height: Math.round((await sharp(absPath).metadata()).height * factor),
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({ sigma: 0.8, m1: 0.5, m2: 0.3 })
    .png()
    .toFile(prepOut);

  return { path: prepOut, upscaled: true, method: "lanczos-sharpen", factor };
}