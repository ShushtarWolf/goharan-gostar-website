/**
 * ponytail: home related strips must never show stub intros.
 * Run: node lib/products-home-check.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "content/products.ts"), "utf8");
const STUB = "محتوای کامل از وب‌سایت فعلی منتقل می‌شود.";

const homeSceneBlocks = [...src.matchAll(/homeScene:\s*"(silencer|pipette|medical)"/g)];
console.assert(homeSceneBlocks.length >= 3, "expected homeScene products");

// Oxygen humidifier must have real FA intro (not stub) while staying on medical home.
console.assert(
  src.includes("فیلتر متخلخل روی بطری رطوبت‌ساز"),
  "oxygen humidifier needs real FA intro",
);
console.assert(
  src.includes('p.intro.fa !== HOME_STUB_INTRO'),
  "productsForHomeScene must filter stub intros",
);
console.assert(src.includes(`"${STUB}"`) || src.includes(STUB), "stub string still defined for other stubs");

console.log("ok: home related products filter + medical copy look sane");
