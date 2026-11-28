import type { Localized } from "@/lib/i18n";

export const ui = {
  brand: "GXPORE",
  company: {
    fa: "گوهران گستر نادین",
    tr: "Goharan Gostar Nadin",
    en: "Goharan Gostar Nadin",
  } satisfies Localized<string>,
  nav: {
    home: { fa: "خانه", tr: "Ana Sayfa", en: "Home" },
    products: { fa: "محصولات", tr: "Ürünler", en: "Products" },
    industries: { fa: "صنایع", tr: "Sektörler", en: "Industries" },
    applications: { fa: "کاربردها", tr: "Uygulamalar", en: "Applications" },
    about: { fa: "درباره ما", tr: "Hakkımızda", en: "About" },
    contact: { fa: "تماس", tr: "İletişim", en: "Contact" },
    catalogs: { fa: "کاتالوگ‌ها", tr: "Kataloglar", en: "Catalogs" },
    faq: { fa: "سوالات متداول", tr: "SSS", en: "FAQ" },
    career: { fa: "فرصت‌های شغلی", tr: "Kariyer", en: "Careers" },
    responsibility: { fa: "مسئولیت ما", tr: "Sorumluluk", en: "Responsibility" },
    material: { fa: "پلاستیک متخلخل", tr: "Gözenekli plastik", en: "Porous plastic" },
  } satisfies Record<string, Localized<string>>,
  navMain: {
    about: { fa: "درباره ما", tr: "Hakkımızda", en: "About us" },
    departments: { fa: "دپارتمان‌ها", tr: "Bölümler", en: "Departments" },
    applications: { fa: "کاربردها", tr: "Uygulamalar", en: "Applications" },
    knowledge: { fa: "پایگاه دانش", tr: "Bilgi merkezi", en: "Knowledge base" },
    contact: { fa: "تماس با ما", tr: "Bize ulaşın", en: "Contact us" },
  } satisfies Record<string, Localized<string>>,
  navMainShort: {
    about: { fa: "درباره ما", tr: "Hakkımızda", en: "About" },
    departments: { fa: "دپارتمان‌ها", tr: "Bölümler", en: "Depts." },
    applications: { fa: "کاربردها", tr: "Uygulama", en: "Uses" },
    knowledge: { fa: "پایگاه دانش", tr: "Bilgi", en: "Knowledge" },
    contact: { fa: "تماس با ما", tr: "İletişim", en: "Contact" },
  } satisfies Record<string, Localized<string>>,
  footerNav: {
    news: { fa: "اخبار", tr: "Haberler", en: "News" },
    knowledge: { fa: "پایگاه دانش", tr: "Bilgi merkezi", en: "Knowledge base" },
    products: { fa: "محصولات", tr: "Ürünler", en: "Products" },
    departments: { fa: "دپارتمان‌ها", tr: "Bölümler", en: "Departments" },
    careers: { fa: "فرصت‌های شغلی", tr: "Kariyer", en: "Careers" },
  } satisfies Record<string, Localized<string>>,
  footerContact: {
    heading: { fa: "تماس با ما", tr: "İletişim", en: "Contact" },
    headOffice: {
      fa: "دفتر مرکزی: قیطریه، بلوار اندرزگو، پلاک ۱۰۴، واحد ۲",
      tr: "Genel merkez: Gheytarieh, Andarzgoo Bulvarı, no. 104, birim 2",
      en: "Head office: Gheytarieh, Andarzgoo Blvd., No. 104, Unit 2",
    },
    factory: {
      fa: "کارخانه: شهرک صنعتی شمس‌آباد، بلوار خیام، کنارگذر اتوماتیک یاران، خیابان اول، پلاک ۱۵",
      tr: "Fabrika: Şemsabad Sanayi Bölgesi, Hayyam Bulvarı, Yaran Otomatik Yan Yol, 1. Sokak, no. 15",
      en: "Factory: Shamsabad Industrial Town, Khayyam Blvd., Yaran Automatic Bypass, 1st Street, No. 15",
    },
    turkey: {
      fa: "دفتر ترکیه: استانبول",
      tr: "Türkiye ofisi: İstanbul",
      en: "Turkey office: Istanbul",
    },
    phonesIran: ["+989108108966", "+989129309178", "+982191309167"],
    linkedin: {
      url: "https://www.linkedin.com/company/goharan-gostar-nadin/",
      label: { fa: "لینکدین", tr: "LinkedIn", en: "LinkedIn" },
    },
  },
  navShort: {
    products: { fa: "محصولات", tr: "Ürünler", en: "Products" },
    applications: { fa: "کاربردها", tr: "Uygulama", en: "Uses" },
    about: { fa: "درباره", tr: "Hakkında", en: "About" },
    contact: { fa: "تماس", tr: "İletişim", en: "Contact" },
  } satisfies Record<string, Localized<string>>,
  industriesPage: {
    title: { fa: "صنایع", tr: "Sektörler", en: "Industries" },
    subtitle: {
      fa: "ده حوزهٔ کاربرد از کاتالوگ رسمی GXPORE — بدون نمایش قیمت.",
      tr: "GXPORE resmi kataloğundaki on uygulama alanı — fiyat gösterilmez.",
      en: "Ten application fields from the official GXPORE catalog — prices are not shown.",
    },
    all: { fa: "همه صنایع", tr: "Tüm sektörler", en: "All industries" },
    productCount: { fa: "محصول", tr: "ürün", en: "products" },
  },
  productsPage: {
    title: { fa: "محصولات", tr: "Ürünler", en: "Products" },
    all: { fa: "همه", tr: "Tümü", en: "All" },
    empty: {
      fa: "محصولی در این گروه نیست.",
      tr: "Bu grupta ürün yok.",
      en: "No products in this group.",
    },
  },
  productDetail: {
    intro: { fa: "معرفی", tr: "Giriş", en: "Introduction" },
    features: { fa: "ویژگی‌ها", tr: "Özellikler", en: "Features" },
    specs: { fa: "مشخصات فنی", tr: "Teknik Özellikler", en: "Technical Specifications" },
    placeholderNote: {
      fa: "جدول مشخصات به‌زودی با داده‌های نهایی به‌روزرسانی می‌شود.",
      tr: "Teknik tablo yakında nihai verilerle güncellenecektir.",
      en: "The specifications table will be updated with final data soon.",
    },
    back: { fa: "بازگشت به محصولات", tr: "Ürünlere dön", en: "Back to products" },
    imageCredit: {
      fa: "اعتبار تصویر",
      tr: "Görsel kaynağı",
      en: "Image credit",
    },
  },
  contact: {
    title: { fa: "تماس با ما", tr: "İletişim", en: "Contact Us" },
    iran: {
      fa: "دفتر ایران: قیطریه، بلوار اندرزگو، پلاک ۱۰۴، واحد ۲",
      tr: "İran Ofisi: Gheytarieh, Andarzgoo Bulvarı, no. 104, birim 2",
      en: "Iran Office: Gheytarieh, Andarzgoo Blvd., No. 104, Unit 2",
    },
    turkey: {
      fa: "دفتر ترکیه: استانبول",
      tr: "Türkiye Ofisi: İstanbul",
      en: "Turkey Office: Istanbul",
    },
    phoneIran: "+989129309178",
    phoneTurkey: "00905377067466",
    email: "info@goharangostar.com",
  },
  ctaContact: {
    fa: "تماس با ما",
    tr: "Bize ulaşın",
    en: "Contact us",
  },
  footer: {
    fa: "© گوهران گستر نادین · GXPORE",
    tr: "© Goharan Gostar Nadin · GXPORE",
    en: "© Goharan Gostar Nadin · GXPORE",
  },
} as const;
