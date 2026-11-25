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
  },
  contact: {
    title: { fa: "تماس با ما", tr: "İletişim", en: "Contact Us" },
    iran: {
      fa: "دفتر ایران: تهران، خیابان آزادی، خیابان حبیب‌اللهی، خیابان قاسمی، پلاک ۳۱، طبقه دوم",
      tr: "İran Ofisi: 2. Kat, no. 31, Qasemi sk., Habibullah sk., Azadi Cd., Tahran",
      en: "Iran Office: 2nd Floor, no. 31, Qasemi St., Habibollah St., Azadi St., Tehran",
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
