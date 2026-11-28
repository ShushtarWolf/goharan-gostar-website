import sharp from "sharp";

/** Gray-world WB + mild contrast + cyan glass grade on RGB; preserve alpha. */
export async function gradeSubjectRgba(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  let n = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (data[i + 3] < 96) continue;
      rSum += data[i];
      gSum += data[i + 1];
      bSum += data[i + 2];
      n++;
    }
  }

  if (n < 10) return sharp(input).png().toBuffer();

  const avgR = rSum / n;
  const avgG = gSum / n;
  const avgB = bSum / n;
  const gray = (avgR + avgG + avgB) / 3;
  const gr = clamp(gray / Math.max(avgR, 1), 0.88, 1.12);
  const gg = clamp(gray / Math.max(avgG, 1), 0.88, 1.14);
  const gb = clamp(gray / Math.max(avgB, 1), 0.9, 1.16);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const a = data[i + 3];
      if (a < 8) continue;
      let r = data[i] * gr;
      let g = data[i + 1] * gg * 1.02;
      let b = data[i + 2] * gb * 1.04;
      const lum = (r + g + b) / 3;
      const contrast = 1.06;
      const mid = 128;
      r = (r - mid) * contrast + mid;
      g = (g - mid) * contrast + mid;
      b = (b - mid) * contrast + mid;
      data[i] = clampByte(r);
      data[i + 1] = clampByte(g);
      data[i + 2] = clampByte(b);
    }
  }

  return sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toBuffer();
}

function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}

function clampByte(v) {
  return Math.min(255, Math.max(0, Math.round(v)));
}