/**
 * Fetches FA/EN WordPress page HTML via REST, extracts copy for products & static pages.
 * Run: node scripts/sync-wp-content.mjs
 */
import fs from "node:fs";
import path from "node:path";

const WP_SLUG_TO_PRODUCT = {
  "صداگیر-پنوماتیک": "pneumatic-silencer",
  "pipette-tips-filter": "pipette-tips-filter",
  "فیلتر-توقف-جریان-کیسه-ساکشن": "stopper-valve-filter",
  "فیلتر-دیالیز": "dialysis-filter",
  "نوک-هایلایتر": "highlighter-nib",
  "فیلتر-شعله-پوش": "flame-arrestor",
  "لوله-های-دیفیوزر": "diffusion-tubes",
  "فیلترهای-انحلال": "dissolution-filters",
  "مخزن-و-فتیله-الکترولیت": "electrolyte-reservoirs-and-wicks",
  "فیلتر-و-دریچه-مخزن-مایع": "fluid-reservoir-vents-filters",
  "مخزن-و-فتیله-سیال": "fluid-reservoirs-and-wicks",
  "فیلترهای-پروفایل": "profile-ii-filters",
  "فیلتر-بطری-رطوبت‌ساز-اکسیژن": "oxygen-humidifier-bottle-filter",
  "فیلتر-بطری-مرطوب‌کننده-اکسیژن": "oxygen-humidifier-bottle-filter",
  "فتیله-عطر": "perfume-wicks",
  "فتیله-خوشبوکننده": "perfume-wicks",
  "فتیله-حشره‌کش": "insecticide-wicks",
  "دیفیوزر-آکواریوم": "aquarium-diffuser",
  "پیش‌فیلتر-کربن-بلاک": "carbon-block-pre-filters",
  "پیش‌فیلتر-بلوک-کربن": "carbon-block-pre-filters",
  "فیلتر-بطری-ورزشی": "sports-water-bottle-filters",
  "فیلتر-بطری-آب-ورزشی": "sports-water-bottle-filters",
  "فیلتر-استخر": "swimming-pool-filters",
  "فیلتر-استخر-شنای": "swimming-pool-filters",
  "کارتریج-فیلتر-متخلخل": "sintered-filter-cartridge",
  "سیلندر-فیلتر-فلزی-متخلخل-ضدزنگ": "sintered-micron-stainless-steel-porous-metal-filter-cylinder",
  "فیلتر-صفحه‌ای-متخلخل-۲۰-میکرون": "sintered-porous-metal-filter-disc-20-micron",
  "کارتریج-فیلتر-استیل-زینتر": "sintered-stainless-steel-filter-cartridge",
  "فیلتر-بخار": "steam-filter",
  "فریت-الیاف-پلی‌پروپیلن": "polypropylene-fiber-frits",
  "فریت-آب‌گریز": "hydrophobic-frits",
  "فریت-آب‌دوست": "hydrophilic-frits",
  "فیلتر-سرنگ": "syringe-filters",
  "فیلتر-سرنگ-استریل": "sterile-syringe-filters",
  "ستون-تخلیص-اسید-نوکلئیک": "empty-gravity-flow-nucleic-acid-purification-columns",
};

const EN_PATH_TO_SLUG = JSON.parse(
  fs.readFileSync("content/products.json", "utf8"),
).reduce((acc, p) => {
  const tail = p.wpUrl.split("/").filter(Boolean).pop();
  acc[tail] = p.slug;
  return acc;
}, {});

const BOILERPLATE = [
  "در فضای مهندسی مواد پیشرفته",
  "شرکت گوهران گستر نادین",
  "Iran Office:",
  "دفتر ایران:",
  "{{ commentData",
];

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;/g, "–")
    .replace(/&amp;/g, "&")
    .replace(/\s+\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function cleanBody(text) {
  let t = text;
  for (const m of BOILERPLATE) {
    const i = t.indexOf(m);
    if (i > 80) t = t.slice(0, i).trim();
  }
  return t.replace(/\n{3,}/g, "\n\n").trim();
}

function extractLists(html) {
  const items = [];
  for (const m of html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)) {
    const item = stripHtml(m[1]);
    if (item.length > 3 && item.length < 500) items.push(item);
  }
  return items;
}

function extractTables(html) {
  const tables = [];
  for (const m of html.matchAll(/<table[\s\S]*?<\/table>/gi)) {
    const rows = [];
    for (const tr of m[0].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
      const cells = [];
      for (const c of tr[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)) {
        cells.push(stripHtml(c[1]));
      }
      if (cells.length) rows.push(cells);
    }
    if (rows.length > 1) tables.push(rows);
  }
  return tables;
}

function extractAccordion(html) {
  const items = [];
  for (const m of html.matchAll(
    /bdt-ep-accordion-item[\s\S]*?bdt-ep-title-text[\s\S]*?>([^<]+)<[\s\S]*?bdt-ep-accordion-content[\s\S]*?>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi,
  )) {
    const q = m[1].trim();
    const a = cleanBody(stripHtml(m[2]));
    if (q && a) items.push({ q, a });
  }
  return items;
}

function resolveProductSlug(page) {
  const link = decodeURIComponent(page.link);
  const parts = link.replace(/\/$/, "").split("/");
  const last = parts.pop();
  if (EN_PATH_TO_SLUG[last]) return EN_PATH_TO_SLUG[last];
  if (WP_SLUG_TO_PRODUCT[last]) return WP_SLUG_TO_PRODUCT[last];
  if (last && !last.includes("%")) return last;
  return null;
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "goharan-gostar-sync/1.0" },
  });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return res.json();
}

async function allPages(base) {
  const pages = [];
  let page = 1;
  while (true) {
    const batch = await fetchJson(
      `${base}/wp-json/wp/v2/pages?per_page=100&page=${page}`,
    );
    if (!batch.length) break;
    pages.push(...batch);
    if (batch.length < 100) break;
    page++;
  }
  return pages;
}

const STATIC_FA = {
  about: "درباره-ما",
  faq: "سوالات-متداول",
  responsibility: "مسئولیت-ما",
  career: "فرصت-های-شغلی",
  catalogs: "کاتالوگ-ها",
  material: "کاربرد-قطعات-متخلخل", // check
  applications: "کاربرد-قطعات-متخلخل",
  contact: "تماس-با-ما",
};

const STATIC_EN = {
  about: "about-us",
  faq: "faq",
  responsibility: "our-responsibility",
  career: "career-opportunities",
  catalogs: "catalogs",
  material: "sintered-porous-plastic",
  applications: "application-porous-parts",
  contact: "contact-us",
};

function pageBySlug(pages, slug) {
  return pages.find((p) => p.slug === slug);
}

function pageContent(page) {
  const html = page.content?.rendered ?? "";
  return {
    title: stripHtml(page.title?.rendered ?? ""),
    paragraphs: cleanBody(stripHtml(html))
      .split(/\n+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 40),
    lists: extractLists(html),
    tables: extractTables(html),
    accordion: extractAccordion(html),
    link: page.link,
  };
}

const productsJson = JSON.parse(fs.readFileSync("content/products.json", "utf8"));
const mediaBySlug = Object.fromEntries(
  productsJson.map((p) => [
    p.slug,
    (p.images ?? []).map((img) =>
      img.startsWith("/photos/") ? img : `/products/${path.basename(img)}`.replace(/^\/products\/(.+)$/, (_, f) => {
        if (img.startsWith("/products/")) return img;
        return `/products/${f}`;
      }),
    ).map((img) => (img.startsWith("/") ? img : `/products/${img}`)),
  ]),
);

// fix media paths from json (already /products/...)
for (const p of productsJson) {
  mediaBySlug[p.slug] = p.images ?? [];
}

async function main() {
  console.log("Fetching FA pages…");
  const faPages = await allPages("https://goharangostar.com/fa");
  console.log("Fetching EN pages…");
  const enPages = await allPages("https://goharangostar.com");

  const products = {};
  for (const page of [...faPages, ...enPages]) {
    const slug = resolveProductSlug(page);
    if (!slug || !productsJson.find((p) => p.slug === slug)) continue;
    const locale = page.link.includes("/fa/") ? "fa" : "en";
    if (!products[slug]) products[slug] = { slug };
    const data = pageContent(page);
    products[slug][locale] = data;
    products[slug].wpPath = products[slug].wpPath ?? {};
    products[slug].wpPath[locale] = new URL(page.link).pathname;
    if (data.tables.length) {
      products[slug].tables = products[slug].tables ?? {};
      products[slug].tables[locale] = data.tables[0];
    }
  }

  const staticPages = {};
  for (const [key, faSlug] of Object.entries(STATIC_FA)) {
    const enSlug = STATIC_EN[key];
    const fa = pageBySlug(faPages, faSlug);
    const en = pageBySlug(enPages, enSlug);
    staticPages[key] = {
      fa: fa ? pageContent(fa) : null,
      en: en ? pageContent(en) : null,
    };
  }

  // Material page: FA slug might differ
  if (!staticPages.material?.fa?.paragraphs?.length) {
    const mat = faPages.find((p) =>
      decodeURIComponent(p.link).includes("متخلخل"),
    );
    if (mat) staticPages.material.fa = pageContent(mat);
  }

  const out = {
    generatedAt: new Date().toISOString(),
    products,
    staticPages,
    mediaBySlug,
  };

  fs.writeFileSync(
    "content/wp-sync.json",
    JSON.stringify(out, null, 2),
    "utf8",
  );
  console.log(
    "Wrote content/wp-sync.json — products:",
    Object.keys(products).length,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});