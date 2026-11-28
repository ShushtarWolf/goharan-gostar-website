import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PYTHON_ESRGAN = path.join(__dirname, "run-esrgan.py");

const NCNN_BIN =
  process.env.REALESRGAN_BIN ??
  "/tmp/realesrgan-ncnn/realesrgan-ncnn-vulkan-v0.2.0-ubuntu/realesrgan-ncnn-vulkan";

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
      {
        encoding: "utf8",
        timeout: 300_000,
        cwd: path.dirname(NCNN_BIN),
      },
    );
    if (r.status === 0 && fs.existsSync(prepOut)) {
      const upLong = await sourceLongEdge(prepOut);
      const denoised = path.join(workDir, `${base}-esrgan-denoised.png`);
      await sharp(prepOut)
        .median(1)
        .sharpen({ sigma: 0.65, m1: 0.45, m2: 0.25 })
        .png()
        .toFile(denoised);
      return { path: denoised, upscaled: true, method: "realesrgan-ncnn", upLong };
    }
  }

  const py = spawnSync("python3", [PYTHON_ESRGAN, prepIn, prepOut], {
    encoding: "utf8",
    timeout: 600_000,
  });
  if (py.status === 0 && fs.existsSync(prepOut)) {
    const upLong = await sourceLongEdge(prepOut);
    const denoised = path.join(workDir, `${base}-esrgan-denoised.png`);
    await sharp(prepOut)
      .median(1)
      .sharpen({ sigma: 0.55, m1: 0.4, m2: 0.2 })
      .png()
      .toFile(denoised);
    return { path: denoised, upscaled: true, method: "realesrgan-python", upLong };
  }

  const meta = await sharp(absPath).metadata();
  const factor = Math.min(4, Math.ceil(UPSCALE_TARGET / Math.max(long, 1)));
  await sharp(absPath)
    .resize({
      width: Math.round((meta.width ?? long) * factor),
      height: Math.round((meta.height ?? long) * factor),
      kernel: sharp.kernel.lanczos3,
    })
    .median(1)
    .sharpen({ sigma: 0.8, m1: 0.5, m2: 0.3 })
    .png()
    .toFile(prepOut);

  return { path: prepOut, upscaled: true, method: "lanczos-sharpen", factor };
}