import type { CategoryId } from "@/content/categories";
import type { Localized } from "@/lib/i18n";

export type SpecsStatus = "ok" | "partial" | "placeholder" | "none";

export type Product = {
  slug: string;
  category: CategoryId;
  /** Homepage scene folder id, if this product group appears after a scrub scene */
  homeScene?: "silencer" | "pipette" | "medical";
  name: Localized<string>;
  intro: Localized<string>;
  features: Localized<string[]>;
  /** Markdown-ish table rows: first row = headers */
  specsTable: Localized<string[][]> | null;
  specsStatus: SpecsStatus;
  wpPath: { fa?: string; en?: string; tr?: string };
};

const placeholderTable: string[][] = [
  ["ستون اول", "ستون دوم", "ستون سوم", "ستون چهارم"],
  ["ردیف اول", "ردیف دوم", "ردیف سوم", "ردیف چهارم"],
];

const placeholderTableEn: string[][] = [
  ["First Column", "Second Column", "Third Column", "Fourth Column"],
  ["First Row", "Second Row", "Third Row", "Fourth Row"],
];

const placeholderTableTr: string[][] = [
  ["Birinci Sütun", "İkinci Sütun", "Üçüncü Sütun", "Dördüncü Sütun"],
  ["Birinci Satır", "İkinci Satır", "Üçüncü Satır", "Dördüncü Satır"],
];

function stub(
  slug: string,
  category: CategoryId,
  name: Localized<string>,
  intro: Localized<string>,
  opts?: Partial<Pick<Product, "homeScene" | "specsStatus" | "features" | "wpPath">>,
): Product {
  return {
    slug,
    category,
    name,
    intro,
    features: opts?.features ?? { fa: [], tr: [], en: [] },
    specsTable: {
      fa: placeholderTable,
      tr: placeholderTableTr,
      en: placeholderTableEn,
    },
    specsStatus: opts?.specsStatus ?? "placeholder",
    homeScene: opts?.homeScene,
    wpPath: opts?.wpPath ?? {},
  };
}

export const products: Product[] = [
  {
    slug: "pneumatic-silencer",
    category: "industrial",
    homeScene: "silencer",
    name: {
      fa: "صداگیر پنوماتیک",
      tr: "Pnömatik Susturucu",
      en: "Pneumatic Silencer",
    },
    intro: {
      fa: "صداگیر یا اگزوز پنوماتیک در مسیر خروجی هوا نصب می‌شود و با کاهش فشار و شدت هوای خروجی، صدا را کم کرده و از آسیب به افراد یا وسایل جلوگیری می‌کند. فیلتر متخلخل داخلی با حفرات پرپیچ‌وخم، نقش اصلی کاهش صدا را دارد.",
      tr: "Pnömatik susturucu, hava çıkış hattına monte edilir; çıkış basıncı ve şiddetini düşürerek gürültüyü azaltır ve insanlara veya ekipmana zarar gelmesini önler. Gözenekli iç filtre, ses azaltmanın ana unsurudur.",
      en: "A pneumatic silencer is installed on the exhaust path of pneumatic devices. By reducing outlet pressure and intensity it lowers noise and protects people and equipment. The porous internal filter with tortuous pores does the primary silencing work.",
    },
    features: {
      fa: [
        "کاهش حداکثری صدای هوای فشرده خروجی",
        "کاهش فشار و شدت هوای خروجی",
        "حذف ناخالصی‌ها و کاهش آلودگی محیط",
        "استحکام بالا و عمر طولانی",
        "نسخه‌های پلاستیکی و فلزی بر اساس کاربرد",
      ],
      tr: [
        "Çıkış havası gürültüsünü maksimum düzeyde azaltma",
        "Basınç ve şiddeti düşürme",
        "Kirleticileri ayırma ve çevreyi koruma",
        "Yüksek dayanım ve uzun ömür",
        "Uygulamaya göre plastik veya metal seçenekler",
      ],
      en: [
        "Maximum reduction of compressed-air exhaust noise",
        "Lower outlet pressure and intensity",
        "Remove impurities and reduce environmental contamination",
        "High strength and long service life",
        "Plastic or metal versions by application",
      ],
    },
    specsStatus: "ok",
    specsTable: {
      fa: [
        ["شماره محصول", "مدل (اینچ)", "طول (میلیمتر)", "قطر (میلیمتر)", "اندازه دهانه (میلیمتر)", "سطح صدا (دسی‌بل)"],
        ["1", "1/8", "37", "16", "15", "74"],
        ["2", "1/4", "65", "21", "18", "76"],
        ["3", "3/8", "83", "25", "21", "82"],
        ["4", "1/2", "93", "30", "22.5", "82"],
        ["5", "3/4", "100-101", "45", "33", "85"],
        ["6", "1", "102", "45", "32.5", "90"],
      ],
      tr: [
        ["No", "Model (inç)", "Uzunluk (mm)", "Çap (mm)", "Ağız (mm)", "Ses (dB)"],
        ["1", "1/8", "37", "16", "15", "74"],
        ["2", "1/4", "65", "21", "18", "76"],
        ["3", "3/8", "83", "25", "21", "82"],
        ["4", "1/2", "93", "30", "22.5", "82"],
        ["5", "3/4", "100-101", "45", "33", "85"],
        ["6", "1", "102", "45", "32.5", "90"],
      ],
      en: [
        ["No", "Model (inch)", "Length (mm)", "Diameter (mm)", "Port (mm)", "Noise (dB)"],
        ["1", "1/8", "37", "16", "15", "74"],
        ["2", "1/4", "65", "21", "18", "76"],
        ["3", "3/8", "83", "25", "21", "82"],
        ["4", "1/2", "93", "30", "22.5", "82"],
        ["5", "3/4", "100-101", "45", "33", "85"],
        ["6", "1", "102", "45", "32.5", "90"],
      ],
    },
    wpPath: {
      fa: "/fa/محصولات/صنعتی/صداگیر-پنوماتیک/",
      en: "/products/industrial/pneumatic-silencer/",
    },
  },
  {
    slug: "pipette-tips-filter",
    category: "laboratory-filtration",
    homeScene: "pipette",
    name: {
      fa: "فیلتر سرسمپلر",
      tr: "Pipet Ucu Filtresi",
      en: "Pipette Tips Filter",
    },
    intro: {
      fa: "فیلتر سرسمپلر با ساختار متخلخل و حفرات یکنواخت از آلودگی نمونه و انتقال متقابل جلوگیری می‌کند و نتایج آنالیز قابل‌اطمینان‌تری می‌سازد. ابعاد و اندازه حفرات قابل سفارشی‌سازی است.",
      tr: "Pipet ucu filtresi, düzenli gözenek yapısıyla numune kirlenmesini ve çapraz bulaşmayı önler; daha güvenilir analiz sonuçları sağlar. Boyut ve gözenek çapı özelleştirilebilir.",
      en: "A pipette tip filter with uniform porous structure prevents sample contamination and cross-talk, supporting more reliable analysis. Dimensions and pore size are customizable.",
    },
    features: {
      fa: [
        "کاملاً خالص و استریل",
        "حفرات یکنواخت و قابل سفارشی‌سازی (۱–۵۰ میکرون)",
        "ابعاد دقیق برای نصب محکم",
        "بسته‌بندی استاندارد و استریل",
      ],
      tr: [
        "Saf ve steril",
        "Düzgün, özelleştirilebilir gözenekler (1–50 µm)",
        "Sıkı montaj için hassas boyutlar",
        "Standart steril paketleme",
      ],
      en: [
        "Pure and sterile",
        "Uniform customizable pores (1–50 µm)",
        "Precise dimensions for secure fit",
        "Standard sterile packaging",
      ],
    },
    specsStatus: "ok",
    specsTable: {
      fa: [
        ["شماره", "قطر (mm)", "ضخامت (mm)", "حفره (µm)", "کاربرد"],
        ["1", "1.4", "1.6", "10", "10 μL"],
        ["2", "1.6", "3.5", "10", "10 μL"],
        ["3", "1.8", "3.5", "10-10.5", "10 μL"],
        ["4", "2", "3.5", "10", "20 μL"],
        ["5", "2.2", "3.5", "10", "20 μL"],
        ["6", "2.5", "3.5", "10", "20 μL"],
        ["7", "2.8", "3.5", "10", "20 μL"],
        ["8", "3.6", "3.5", "10", "100 μL"],
        ["9", "3.8", "3.5", "10", "100 μL"],
        ["10", "4.1", "3.5", "10", "200 μL"],
        ["11", "4.5", "3.5", "10", "200 μL"],
        ["12", "4.7", "3.5", "10-10.5", "200 μL"],
        ["13", "6.1", "3.5", "10", "500 μL"],
        ["14", "7.0", "4.0", "10", "1000 μL"],
        ["15", "7.1", "4.0", "10.5", "1000 μL"],
        ["16", "7.2", "4.0", "10", "1000 μL"],
        ["17", "7.4", "4.0", "10", "1000 μL"],
        ["18", "9.0", "4.0", "10", "5000 μL"],
        ["19", "12.5", "3.5", "10", "5000 μL"],
        ["20", "14.2", "4.0", "10", "10000 μL"],
      ],
      tr: [
        ["No", "Çap (mm)", "Kalınlık (mm)", "Gözenek (µm)", "Uygulama"],
        ["1", "1.4", "1.6", "10", "10 μL"],
        ["2", "1.6", "3.5", "10", "10 μL"],
        ["3", "1.8", "3.5", "10-10.5", "10 μL"],
        ["4", "2", "3.5", "10", "20 μL"],
        ["5", "2.2", "3.5", "10", "20 μL"],
        ["6", "2.5", "3.5", "10", "20 μL"],
        ["7", "2.8", "3.5", "10", "20 μL"],
        ["8", "3.6", "3.5", "10", "100 μL"],
        ["9", "3.8", "3.5", "10", "100 μL"],
        ["10", "4.1", "3.5", "10", "200 μL"],
        ["11", "4.5", "3.5", "10", "200 μL"],
        ["12", "4.7", "3.5", "10-10.5", "200 μL"],
        ["13", "6.1", "3.5", "10", "500 μL"],
        ["14", "7.0", "4.0", "10", "1000 μL"],
        ["15", "7.1", "4.0", "10.5", "1000 μL"],
        ["16", "7.2", "4.0", "10", "1000 μL"],
        ["17", "7.4", "4.0", "10", "1000 μL"],
        ["18", "9.0", "4.0", "10", "5000 μL"],
        ["19", "12.5", "3.5", "10", "5000 μL"],
        ["20", "14.2", "4.0", "10", "10000 μL"],
      ],
      en: [
        ["No", "Diameter (mm)", "Thickness (mm)", "Pore (µm)", "Use"],
        ["1", "1.4", "1.6", "10", "10 μL"],
        ["2", "1.6", "3.5", "10", "10 μL"],
        ["3", "1.8", "3.5", "10-10.5", "10 μL"],
        ["4", "2", "3.5", "10", "20 μL"],
        ["5", "2.2", "3.5", "10", "20 μL"],
        ["6", "2.5", "3.5", "10", "20 μL"],
        ["7", "2.8", "3.5", "10", "20 μL"],
        ["8", "3.6", "3.5", "10", "100 μL"],
        ["9", "3.8", "3.5", "10", "100 μL"],
        ["10", "4.1", "3.5", "10", "200 μL"],
        ["11", "4.5", "3.5", "10", "200 μL"],
        ["12", "4.7", "3.5", "10-10.5", "200 μL"],
        ["13", "6.1", "3.5", "10", "500 μL"],
        ["14", "7.0", "4.0", "10", "1000 μL"],
        ["15", "7.1", "4.0", "10.5", "1000 μL"],
        ["16", "7.2", "4.0", "10", "1000 μL"],
        ["17", "7.4", "4.0", "10", "1000 μL"],
        ["18", "9.0", "4.0", "10", "5000 μL"],
        ["19", "12.5", "3.5", "10", "5000 μL"],
        ["20", "14.2", "4.0", "10", "10000 μL"],
      ],
    },
    wpPath: {
      fa: "/fa/محصولات/فیلتراسیون-آزمایشگاه/pipette-tips-filter/",
      en: "/products/laboratory-filtration/pipette-tips-filter/",
    },
  },
  {
    slug: "stopper-valve-filter",
    category: "medical-devices",
    homeScene: "medical",
    name: {
      fa: "فیلتر توقف جریان کیسه ساکشن",
      tr: "Aspirasyon Torbası Akış Durdurma Filtresi",
      en: "Stopper Valve Filter",
    },
    intro: {
      fa: "فیلتر متخلخل گزینشی که هوا را عبور می‌دهد و با رسیدن مایع مسدود می‌شود؛ از پخش عفونت و آسیب به دستگاه مکش جلوگیری می‌کند و افت فشار را حداقل نگه می‌دارد.",
      tr: "Havayı geçirip sıvıya değince kapanan seçici gözenekli filtre; enfeksiyon yayılımını ve aspirasyon cihazı hasarını önler, basınç düşümünü en aza indirir.",
      en: "A selective porous filter that passes air/gas and blocks on liquid contact, preventing infection spread and suction-device damage while minimizing pressure drop.",
    },
    features: {
      fa: [
        "قطع به‌موقع جریان هنگام پر شدن کیسه",
        "افت فشار کمتر از ۰٫۱ بار",
        "رواداری ابعادی کم",
        "مونتاژ آسان",
      ],
      tr: [
        "Torba dolunca zamanında akış kesme",
        "0,1 bar altı basınç düşümü",
        "Dar boyut toleransı",
        "Kolay montaj",
      ],
      en: [
        "Timely shutoff when the bag fills",
        "Pressure drop under 0.1 bar",
        "Tight dimensional tolerance",
        "Easy assembly",
      ],
    },
    specsStatus: "ok",
    specsTable: {
      fa: [
        ["عنوان بررسی", "استاندارد بررسی"],
        ["ظاهر", "تمیز، تخت و صاف، بدون خراش و آلودگی"],
        ["قطر خارجی (mm)", "18.1 ± 0.30"],
        ["قطر داخلی (mm)", "11.0 ± 0.20"],
        ["ارتفاع (mm)", "27.6 ± 0.50"],
        ["نوع ماده", "HDPE"],
        ["تخلخل (%)", "≥ 30"],
        ["افت فشار (mmHg)", "≤ 100"],
        ["مقاومت هوا پس از قطع آب (mmHg)", "≥ 450"],
        ["بازه pH", "1-14"],
        ["بازه دما (°C)", "-196 تا 80"],
      ],
      tr: [
        ["Madde", "Standart"],
        ["Görünüm", "Temiz, düz, çiziksiz"],
        ["Dış çap (mm)", "18.1 ± 0.30"],
        ["İç çap (mm)", "11.0 ± 0.20"],
        ["Yükseklik (mm)", "27.6 ± 0.50"],
        ["Malzeme", "HDPE"],
        ["Gözeneklilik (%)", "≥ 30"],
        ["Basınç düşümü (mmHg)", "≤ 100"],
        ["Su kesiminden sonra hava direnci (mmHg)", "≥ 450"],
        ["pH aralığı", "1-14"],
        ["Sıcaklık (°C)", "-196 to 80"],
      ],
      en: [
        ["Item", "Standard"],
        ["Appearance", "Clean, flat, no scratch/contamination"],
        ["External diameter (mm)", "18.1 ± 0.30"],
        ["Internal diameter (mm)", "11.0 ± 0.20"],
        ["Height (mm)", "27.6 ± 0.50"],
        ["Material", "HDPE"],
        ["Porosity (%)", "≥ 30"],
        ["Pressure drop (mmHg)", "≤ 100"],
        ["Air resistance after water block (mmHg)", "≥ 450"],
        ["Working pH", "1-14"],
        ["Working temp (°C)", "-196 to 80"],
      ],
    },
    wpPath: {
      fa: "/fa/محصولات/تجهیزات-پزشکی/فیلتر-توقف-جریان-کیسه-ساکشن/",
      en: "/products/medical-devices/stopper-valve-filter/",
    },
  },
  {
    slug: "dialysis-filter",
    category: "medical-devices",
    homeScene: "medical",
    name: {
      fa: "فیلتر دیالیز",
      tr: "Diyaliz Filtresi",
      en: "Dialysis Filter",
    },
    intro: {
      fa: "فیلتر دیالیز نقش حیاتی در همودیالیز دارد و مواد سمی و ناخواسته خون را به‌صورت انتخابی جدا می‌کند. گوهران گستر از تولیدکنندگان تخصصی این فیلتر در ایران و خاورمیانه است.",
      tr: "Diyaliz filtresi hemodiyalizde kritik rol oynar; kandaki toksik ve istenmeyen maddeleri seçici biçimde ayırır. Goharan, İran ve Orta Doğu’da bu alanda uzman üreticilerdendir.",
      en: "A dialysis filter plays a vital role in hemodialysis by selectively removing toxic and unwanted substances from blood. Goharan is a specialized producer in Iran and the Middle East.",
    },
    features: {
      fa: ["کاهش پس‌فشار", "افزایش بازدهی فیلتراسیون"],
      tr: ["Geri basıncı azaltma", "Filtrasyon verimini artırma"],
      en: ["Reduced back pressure", "Higher filtration efficiency"],
    },
    specsStatus: "placeholder",
    specsTable: {
      fa: placeholderTable,
      tr: placeholderTableTr,
      en: placeholderTableEn,
    },
    wpPath: {
      fa: "/fa/محصولات/تجهیزات-پزشکی/فیلتر-دیالیز/",
      en: "/products/medical-devices/dialysis-filter/",
    },
  },
  {
    slug: "highlighter-nib",
    category: "writing-instruments",
    name: {
      fa: "نوک هایلایتر",
      tr: "Fosforlu Kalem Ucu",
      en: "Highlighter Nib",
    },
    intro: {
      fa: "نوک هایلایتر متخلخل پلی‌اتیلنی با جریان جوهر یکنواخت، ضدلکه و قابل سفارشی‌سازی در شکل و اندازه.",
      tr: "Düzgün mürekkep akışlı, leke bırakmayan ve şekil/boyutta özelleştirilebilir gözenekli polietilen fosforlu kalem ucu.",
      en: "Porous polyethylene highlighter nib with even ink flow, anti-bleed behavior, and customizable shape/size.",
    },
    features: {
      fa: ["نرمی و کنترل جوهر", "ضدچسبندگی و مقاوم در برابر آب/حلال", "سفارشی‌سازی ابعاد و کیفیت جریان"],
      tr: ["Yumuşak yazım ve mürekkep kontrolü", "Yapışmaz; su/çözücü direnci", "Boyut ve akış özelleştirme"],
      en: ["Smooth writing and ink control", "Anti-stick; water/solvent resistance", "Custom size and flow"],
    },
    specsStatus: "placeholder",
    specsTable: {
      fa: placeholderTable,
      tr: placeholderTableTr,
      en: placeholderTableEn,
    },
    wpPath: {
      fa: "/fa/محصولات/لوازم-التحریر/نوک-هایلایتر/",
      en: "/products/writing-instruments/highlighter-nib/",
    },
  },
  {
    slug: "flame-arrestor",
    category: "industrial",
    name: {
      fa: "فیلتر شعله پوش",
      tr: "Alev Tutucu Filtre",
      en: "Flame Arrestor",
    },
    intro: {
      fa: "محیط متخلخل برای کنترل گازهای باتری، کاهش نشت الکترولیت و جلوگیری از رسیدن جرقه به داخل باتری.",
      tr: "Akü gazlarını kontrol eden, elektrolit sızıntısını azaltan ve kıvılcımın akü içine ulaşmasını engelleyen gözenekli ortam.",
      en: "Porous media to control battery gases, reduce electrolyte loss, and block external sparks from entering the battery.",
    },
    features: {
      fa: [
        "تخلیه کنترل‌شده گاز",
        "کاهش نشت الکترولیت",
        "جلوگیری از شعله و جرقه",
        "مقاوم شیمیایی",
      ],
      tr: [
        "Kontrollü gaz tahliyesi",
        "Elektrolit sızıntısını azaltma",
        "Alev/kıvılcım engelleme",
        "Kimyasal dayanım",
      ],
      en: [
        "Controlled gas venting",
        "Reduced electrolyte leakage",
        "Flame/spark blocking",
        "Chemical resistance",
      ],
    },
    specsStatus: "partial",
    specsTable: {
      fa: [
        ["قطر (mm)", "ضخامت (mm)", "دبی هوا در 100 mbar (L/min)"],
        ["2.5", "0.8", "–"],
        ["10", "2 / 2.25 / 3.2 / 4.75", "8-15"],
        ["12.7", "2 / 2.25 / 3.2 / 4.75", "10-20"],
        ["16.5", "2 / 2.25 / 3.2 / 4.75", "10-20"],
      ],
      tr: [
        ["Çap (mm)", "Kalınlık (mm)", "Hava debisi @100 mbar (L/min)"],
        ["2.5", "0.8", "–"],
        ["10", "2 / 2.25 / 3.2 / 4.75", "8-15"],
        ["12.7", "2 / 2.25 / 3.2 / 4.75", "10-20"],
        ["16.5", "2 / 2.25 / 3.2 / 4.75", "10-20"],
      ],
      en: [
        ["Diameter (mm)", "Thickness (mm)", "Air flow @100 mbar (L/min)"],
        ["2.5", "0.8", "–"],
        ["10", "2 / 2.25 / 3.2 / 4.75", "8-15"],
        ["12.7", "2 / 2.25 / 3.2 / 4.75", "10-20"],
        ["16.5", "2 / 2.25 / 3.2 / 4.75", "10-20"],
      ],
    },
    wpPath: {
      fa: "/fa/محصولات/صنعتی/فیلتر-شعله-پوش/",
      en: "/products/industrial/flame-arrestor/",
    },
  },
  stub(
    "diffusion-tubes",
    "industrial",
    {
      fa: "لوله‌های دیفیوزر",
      tr: "Difüzör Boruları",
      en: "Diffusion Tubes",
    },
    {
      fa: "لوله‌های متخلخل با خلوص بالا برای دیفیوز، فیلتراسیون و توزیع گاز در فرایندهای نیمه‌رسانا.",
      tr: "Yarı iletken proseslerinde gaz difüzyonu, filtrasyon ve dağıtım için yüksek saflıkta gözenekli borular.",
      en: "High-purity porous tubes for diffusion, filtration and gas distribution in semiconductor processes.",
    },
    {
      specsStatus: "placeholder",
      wpPath: {
        fa: "/fa/محصولات/صنعتی/لوله-های-دیفیوزر/",
        en: "/products/industrial/diffusion-tubes/",
      },
    },
  ),
  stub(
    "sintered-porous-filter-cartridge",
    "oil-gas",
    {
      fa: "کارتریج فیلتر متخلخل",
      tr: "Gözenekli Filtre Kartuşu",
      en: "Sintered Porous Filter Cartridge",
    },
    {
      fa: "فیلتر گاز متخلخل برای نمونه‌برداری جریان پس‌رو یا کنارگذر و کاربردهای فیلتراسیون گاز.",
      tr: "Geri/bypass numune alma ve gaz filtrasyonu için gözenekli gaz filtresi.",
      en: "Porous gas filter for bypass/sidestream sampling and gas filtration duties.",
    },
    {
      specsStatus: "placeholder",
      wpPath: {
        fa: "/fa/محصولات/نفت-و-گاز/کارتریج-فیلتر-متخلخل/",
        en: "/products/oil-gas/sintered-filter-cartridge/",
      },
    },
  ),
  // Remaining WP products — content stubs (no deletion); full copy to be enriched from WP export
  stub("dissolution-filters", "industrial", { fa: "فیلترهای انحلال", tr: "Çözünme Filtreleri", en: "Dissolution Filters" }, { fa: "محتوای کامل از وب‌سایت فعلی منتقل می‌شود.", tr: "Mevcut sitedeki tam içerik aktarılacaktır.", en: "Full copy will be migrated from the current website." }),
  stub("electrolyte-reservoirs-and-wicks", "industrial", { fa: "مخزن و فتیله الکترولیت", tr: "Elektrolit Rezervuar ve Fitilleri", en: "Electrolyte Reservoirs and Wicks" }, { fa: "محتوای کامل از وب‌سایت فعلی منتقل می‌شود.", tr: "Mevcut sitedeki tam içerik aktarılacaktır.", en: "Full copy will be migrated from the current website." }),
  stub("fluid-reservoir-vents-filters", "industrial", { fa: "فیلتر و دریچه مخزن مایع", tr: "Sıvı Rezervuar Havalandırma Filtreleri", en: "Fluid Reservoir Vents Filters" }, { fa: "محتوای کامل از وب‌سایت فعلی منتقل می‌شود.", tr: "Mevcut sitedeki tam içerik aktarılacaktır.", en: "Full copy will be migrated from the current website." }),
  stub("fluid-reservoirs-and-wicks", "industrial", { fa: "مخزن و فتیله سیال", tr: "Akışkan Rezervuar ve Fitilleri", en: "Fluid Reservoirs and Wicks" }, { fa: "محتوای کامل از وب‌سایت فعلی منتقل می‌شود.", tr: "Mevcut sitedeki tam içerik aktarılacaktır.", en: "Full copy will be migrated from the current website." }),
  stub("profile-ii-filters", "industrial", { fa: "فیلترهای پروفایل", tr: "Profil Filtreler", en: "Profile II Filters" }, { fa: "محتوای کامل از وب‌سایت فعلی منتقل می‌شود.", tr: "Mevcut sitedeki tam içerik aktarılacaktır.", en: "Full copy will be migrated from the current website." }),
  stub("oxygen-humidifier-bottle-filter", "medical-devices", { fa: "فیلتر بطری رطوبت‌ساز اکسیژن", tr: "Oksijen Nemlendirici Şişe Filtresi", en: "Oxygen Humidifier Bottle Filter" }, { fa: "محتوای کامل از وب‌سایت فعلی منتقل می‌شود.", tr: "Mevcut sitedeki tam içerik aktarılacaktır.", en: "Full copy will be migrated from the current website." }, { homeScene: "medical" }),
  stub("perfume-wicks", "air-care", { fa: "فتیله عطر", tr: "Parfüm Fitili", en: "Perfume Wicks" }, { fa: "محتوای کامل از وب‌سایت فعلی منتقل می‌شود.", tr: "Mevcut sitedeki tam içerik aktarılacaktır.", en: "Full copy will be migrated from the current website." }),
  stub("insecticide-wicks", "air-care", { fa: "فتیله حشره‌کش", tr: "Böcek İlacı Fitili", en: "Insecticide Wicks" }, { fa: "محتوای کامل از وب‌سایت فعلی منتقل می‌شود.", tr: "Mevcut sitedeki tam içerik aktarılacaktır.", en: "Full copy will be migrated from the current website." }),
  stub("aquarium-diffuser", "water-filtration", { fa: "دیفیوزر آکواریوم", tr: "Akvaryum Difüzörü", en: "Aquarium Diffuser" }, { fa: "محتوای کامل از وب‌سایت فعلی منتقل می‌شود.", tr: "Mevcut sitedeki tam içerik aktarılacaktır.", en: "Full copy will be migrated from the current website." }),
  stub("carbon-block-pre-filters", "water-filtration", { fa: "پیش‌فیلتر کربن بلاک", tr: "Karbon Blok Ön Filtreler", en: "Carbon Block Pre-Filters" }, { fa: "محتوای کامل از وب‌سایت فعلی منتقل می‌شود.", tr: "Mevcut sitedeki tam içerik aktarılacaktır.", en: "Full copy will be migrated from the current website." }),
  stub("sports-water-bottle-filters", "water-filtration", { fa: "فیلتر بطری ورزشی", tr: "Spor Su Şişesi Filtreleri", en: "Sports Water Bottle Filters" }, { fa: "محتوای کامل از وب‌سایت فعلی منتقل می‌شود.", tr: "Mevcut sitedeki tam içerik aktarılacaktır.", en: "Full copy will be migrated from the current website." }),
  stub("swimming-pool-filters", "water-filtration", { fa: "فیلتر استخر", tr: "Havuz Filtreleri", en: "Swimming Pool Filters" }, { fa: "محتوای کامل از وب‌سایت فعلی منتقل می‌شود.", tr: "Mevcut sitedeki tam içerik aktarılacaktır.", en: "Full copy will be migrated from the current website." }),
  stub("sintered-porous-metal-filter-disc-20-micron", "oil-gas", { fa: "فیلتر صفحه‌ای متخلخل ۲۰ میکرون", tr: "20 Mikron Gözenekli Metal Disk Filtre", en: "Sintered Porous Metal Filter Disc 20 Micron" }, { fa: "محتوای کامل از وب‌سایت فعلی منتقل می‌شود.", tr: "Mevcut sitedeki tam içerik aktarılacaktır.", en: "Full copy will be migrated from the current website." }),
  stub("sintered-micron-stainless-steel-porous-metal-filter-cylinder", "oil-gas", { fa: "سیلندر فیلتر فلزی متخلخل ضدزنگ", tr: "Paslanmaz Gözenekli Metal Filtre Silindiri", en: "Sintered Micron Stainless Steel Porous Metal Filter Cylinder" }, { fa: "محتوای کامل از وب‌سایت فعلی منتقل می‌شود.", tr: "Mevcut sitedeki tam içerik aktarılacaktır.", en: "Full copy will be migrated from the current website." }),
  stub("sintered-stainless-steel-filter-cartridge", "oil-gas", { fa: "کارتریج فیلتر استیل زینتر", tr: "Sinterlenmiş Paslanmaz Filtre Kartuşu", en: "Sintered Stainless Steel Filter Cartridge" }, { fa: "محتوای کامل از وب‌سایت فعلی منتقل می‌شود.", tr: "Mevcut sitedeki tam içerik aktarılacaktır.", en: "Full copy will be migrated from the current website." }),
  stub("steam-filter", "oil-gas", { fa: "فیلتر بخار", tr: "Buhar Filtresi", en: "Steam Filter" }, { fa: "محتوای کامل از وب‌سایت فعلی منتقل می‌شود.", tr: "Mevcut sitedeki tam içerik aktarılacaktır.", en: "Full copy will be migrated from the current website." }),
  stub("polypropylene-fiber-frits", "laboratory-filtration", { fa: "فریت الیاف پلی‌پروپیلن", tr: "Polipropilen Fiber Fritler", en: "Polypropylene Fiber Frits" }, { fa: "محتوای کامل از وب‌سایت فعلی منتقل می‌شود.", tr: "Mevcut sitedeki tam içerik aktarılacaktır.", en: "Full copy will be migrated from the current website." }),
  stub("hydrophobic-frits", "laboratory-filtration", { fa: "فریت آب‌گریز", tr: "Hidrofobik Fritler", en: "Hydrophobic Frits" }, { fa: "محتوای کامل از وب‌سایت فعلی منتقل می‌شود.", tr: "Mevcut sitedeki tam içerik aktarılacaktır.", en: "Full copy will be migrated from the current website." }),
  stub("hydrophilic-frits", "laboratory-filtration", { fa: "فریت آب‌دوست", tr: "Hidrofilik Fritler", en: "Hydrophilic Frits" }, { fa: "محتوای کامل از وب‌سایت فعلی منتقل می‌شود.", tr: "Mevcut sitedeki tam içerik aktarılacaktır.", en: "Full copy will be migrated from the current website." }),
  stub("syringe-filters", "laboratory-filtration", { fa: "فیلتر سرنگ", tr: "Şırınga Filtreleri", en: "Syringe Filters" }, { fa: "محتوای کامل از وب‌سایت فعلی منتقل می‌شود.", tr: "Mevcut sitedeki tam içerik aktarılacaktır.", en: "Full copy will be migrated from the current website." }),
  stub("sterile-syringe-filters", "laboratory-filtration", { fa: "فیلتر سرنگ استریل", tr: "Steril Şırınga Filtreleri", en: "Sterile Syringe Filters" }, { fa: "محتوای کامل از وب‌سایت فعلی منتقل می‌شود.", tr: "Mevcut sitedeki tam içerik aktarılacaktır.", en: "Full copy will be migrated from the current website." }),
  stub("empty-gravity-flow-nucleic-acid-purification-columns", "laboratory-filtration", { fa: "ستون تخلیص اسید نوکلئیک", tr: "Nükleik Asit Saflaştırma Kolonları", en: "Empty Gravity Flow Nucleic Acid Purification Columns" }, { fa: "محتوای کامل از وب‌سایت فعلی منتقل می‌شود.", tr: "Mevcut sitedeki tam içerik aktarılacaktır.", en: "Full copy will be migrated from the current website." }),
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function productsByCategory(category: CategoryId | "all") {
  if (category === "all") return products;
  return products.filter((p) => p.category === category);
}

export function productsForHomeScene(scene: NonNullable<Product["homeScene"]>) {
  return products.filter((p) => p.homeScene === scene);
}
