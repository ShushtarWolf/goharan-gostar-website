import type { Localized } from "@/lib/i18n";
import type { CategoryId } from "@/content/categories";

export type IndustryId =
  | "medical-pharmaceutical"
  | "oil-gas-petrochemical"
  | "industrial-tools"
  | "food-beverage"
  | "laboratory"
  | "electronics"
  | "compressed-air-desiccant"
  | "health-environment"
  | "water-wastewater"
  | "stationery"
  | "pva-biodegradable";

export type Industry = {
  id: IndustryId;
  name: Localized<string>;
  intro: Localized<string>;
  /** Legacy products-page grouping (optional cross-link) */
  categoryId?: CategoryId;
};

export const industries: Industry[] = [
  {
    id: "medical-pharmaceutical",
    categoryId: "medical-devices",
    name: {
      fa: "پزشکی و دارویی",
      tr: "Tıbbi ve İlaç",
      en: "Medical & Pharmaceutical",
    },
    intro: {
      fa: "قطعات متخلخل پلیمری برای فیلتراسیون، دارورسانی، تشخیص و ایمنی بالینی.",
      tr: "Klinik filtrasyon, ilaç iletimi ve tanı için gözenekli polimer bileşenler.",
      en: "Porous polymer components for filtration, drug delivery, diagnostics, and clinical safety.",
    },
  },
  {
    id: "oil-gas-petrochemical",
    categoryId: "oil-gas",
    name: {
      fa: "نفت، گاز و پتروشیمی",
      tr: "Petrol, Gaz ve Petrokimya",
      en: "Oil, Gas & Petrochemical",
    },
    intro: {
      fa: "رسانه‌های فیلتراسیون و جداسازی برای پالایش، خطوط لوله و محیط‌های خورنده.",
      tr: "Rafinasyon ve boru hatları için filtrasyon ve ayırma ortamları.",
      en: "Filtration and separation media for refining, pipelines, and corrosive environments.",
    },
  },
  {
    id: "industrial-tools",
    categoryId: "industrial",
    name: {
      fa: "لوازم و ابزارآلات صنعتی",
      tr: "Endüstriyel Araçlar",
      en: "Industrial Tools & Equipment",
    },
    intro: {
      fa: "فیلتر و دریچه برای موتورهای کوچک، مخازن صنعتی و محصولات شوینده.",
      tr: "Küçük motorlar, endüstriyel kaplar ve temizlik ürünleri için filtre ve havalandırma.",
      en: "Filters and vents for small engines, industrial containers, and cleaning products.",
    },
  },
  {
    id: "food-beverage",
    categoryId: "food-and-beverage",
    name: {
      fa: "صنایع غذایی و آشامیدنی",
      tr: "Gıda ve İçecek",
      en: "Food & Beverage",
    },
    intro: {
      fa: "توزیع گاز و مایع با حباب‌های یکنواخت برای فرایندهای غذایی.",
      tr: "Gıda süreçlerinde eşit gaz ve sıvı dağılımı.",
      en: "Even gas and liquid dispersion for food and beverage processing.",
    },
  },
  {
    id: "laboratory",
    categoryId: "laboratory-filtration",
    name: {
      fa: "صنعت آزمایشگاهی",
      tr: "Laboratuvar",
      en: "Laboratory",
    },
    intro: {
      fa: "فیلتر سرسمپلر، SPE، آنالیز مولکولی و رسانه‌های بیوپروسس.",
      tr: "Pipet uçları, SPE ve biyoprocess ortamları.",
      en: "Pipette filters, SPE media, molecular analysis, and bioprocessing.",
    },
  },
  {
    id: "electronics",
    categoryId: "industrial",
    name: {
      fa: "صنعت الکترونیک",
      tr: "Elektronik",
      en: "Electronics",
    },
    intro: {
      fa: "لوله دیفیوزر، مخازن الکترولیت، ونت و قطعات نیمه‌رسان.",
      tr: "Difüzör boruları, elektrolit hazneleri ve yarı iletken bileşenleri.",
      en: "Diffusion tubes, electrolyte reservoirs, vents, and semiconductor process parts.",
    },
  },
  {
    id: "compressed-air-desiccant",
    categoryId: "industrial",
    name: {
      fa: "هوای فشرده و رطوبت‌گیر",
      tr: "Basınçlı Hava ve Nem Alma",
      en: "Compressed Air & Desiccant",
    },
    intro: {
      fa: "سایلنسر و فیلتر پنوماتیک، ونت محفظه و دریچه‌های انتشار.",
      tr: "Pnömatik susturucular, filtreler ve muhafaza havalandırmaları.",
      en: "Pneumatic silencers, filters, enclosure vents, and diffusion layers.",
    },
  },
  {
    id: "health-environment",
    categoryId: "air-care",
    name: {
      fa: "سلامتی و محیط زیست",
      tr: "Sağlık ve Çevre",
      en: "Health & Environment",
    },
    intro: {
      fa: "فتیله‌های خوشبوکننده، حشره‌کش، حذف بو و ساپورت غشایی.",
      tr: "Koku giderici fitiller, böcek ilacı fitilleri ve membran destekleri.",
      en: "Air-care wicks, insecticide diffusion, odor control, and membrane supports.",
    },
  },
  {
    id: "water-wastewater",
    categoryId: "water-filtration",
    name: {
      fa: "تصفیه آب و پساب",
      tr: "Su ve Atıksu Arıtma",
      en: "Water & Wastewater Treatment",
    },
    intro: {
      fa: "پیش‌فیلتر کربن، فیلتر استخر، بطری ورزشی و فیلتراسیون غشایی.",
      tr: "Karbon ön filtre, havuz filtreleri ve membran filtrasyon.",
      en: "Carbon pre-filtration, pool and bottle filters, and membrane systems.",
    },
  },
  {
    id: "pva-biodegradable",
    categoryId: "pva-biodegradable",
    name: {
      fa: "فیلم‌های PVA و بسته‌بندی زیست‌تخریب‌پذیر",
      tr: "PVA filmler ve biyobozunur ambalaj",
      en: "PVA films & biodegradable packaging",
    },
    intro: {
      fa: "گرانول، فیلم و نوار محلول در آب برای بسته‌بندی شوینده، کشاورزی، نساجی و کاربردهای دوست‌دار محیط‌زیست.",
      tr: "Deterjan, tarım ve tekstil için suda çözünen PVA granül, film ve şeritler.",
      en: "Water-soluble PVA granules, films, and tapes for detergent, agriculture, textile, and eco-friendly packaging.",
    },
  },
  {
    id: "stationery",
    categoryId: "writing-instruments",
    name: {
      fa: "نوشت‌افزار",
      tr: "Kırtasiye",
      en: "Stationery",
    },
    intro: {
      fa: "نوک نشانگر متخلخل برای هایلایتر و ماژیک.",
      tr: "Fosforlu kalem ve marker için gözenekli uçlar.",
      en: "Porous nibs for highlighters and markers.",
    },
  },
];

export const industryIds = industries.map((i) => i.id);

export function getIndustry(id: string) {
  return industries.find((i) => i.id === id);
}

export const industryToCategory: Partial<Record<IndustryId, CategoryId>> =
  Object.fromEntries(
    industries
      .filter((i) => i.categoryId)
      .map((i) => [i.id, i.categoryId!]),
  ) as Partial<Record<IndustryId, CategoryId>>;