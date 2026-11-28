import type { Localized } from "@/lib/i18n";

export const homeExtra = {
  collab: {
    eyebrow: { fa: "مشاورهٔ مهندسی", tr: "Mühendislik danışmanlığı", en: "Engineering consulting" } satisfies Localized<string>,
    title: { fa: "چگونه با ما همکاری کنید", tr: "Bizimle nasıl çalışabilirsiniz", en: "How to work with us" } satisfies Localized<string>,
    lead: {
      fa: "برای دریافت مشاورهٔ مهندسی در زمینهٔ قطعات متخلخل، فیلتراسیون و فیلم‌های PVA با ما در ارتباط باشید.",
      tr: "Gözenekli parçalar, filtrasyon ve PVA filmler konusunda mühendislik danışmanlığı almak için bizimle iletişime geçin.",
      en: "Get in touch for engineering consulting on porous parts, filtration, and PVA films.",
    } satisfies Localized<string>,
    steps: [
      {
        title: { fa: "نیاز خود را بفرستید", tr: "İhtiyacınızı iletin", en: "Send us your need" },
        body: {
          fa: "کاربرد و شرایط کار محصول را از طریق تلفن یا ایمیل برای ما توضیح دهید.",
          tr: "Ürünün kullanım alanını ve çalışma koşullarını telefon veya e-posta ile bize anlatın.",
          en: "Describe the application and operating conditions by phone or email.",
        },
      },
      {
        title: { fa: "بررسی مهندسی", tr: "Mühendislik değerlendirmesi", en: "Engineering review" },
        body: {
          fa: "تیم ما نیاز را تحلیل می‌کند و مواد و ساختار مناسب را پیشنهاد می‌دهد.",
          tr: "Ekibimiz ihtiyacı analiz eder ve uygun malzeme ile yapıyı önerir.",
          en: "Our team analyzes the need and proposes a suitable material and structure.",
        },
      },
      {
        title: { fa: "نمونه‌سازی و ارزیابی", tr: "Numune ve değerlendirme", en: "Prototyping and evaluation" },
        body: {
          fa: "عملکرد محصول در شرایط واقعی ارزیابی می‌شود تا راهکار نهایی مشخص شود.",
          tr: "Nihai çözümün belirlenmesi için ürünün performansı gerçek koşullarda değerlendirilir.",
          en: "Performance is evaluated in real conditions to settle on the final solution.",
        },
      },
    ] satisfies { title: Localized<string>; body: Localized<string> }[],
    cta: { fa: "تماس با ما", tr: "Bize ulaşın", en: "Contact us" } satisfies Localized<string>,
  },
  articles: {
    eyebrow: { fa: "پایگاه دانش", tr: "Bilgi merkezi", en: "Knowledge base" } satisfies Localized<string>,
    title: { fa: "مقالات و یادداشت‌های فنی", tr: "Makaleler ve teknik notlar", en: "Articles and technical notes" } satisfies Localized<string>,
    body: {
      fa: "مقالات و یادداشت‌های فنی در پایگاه دانش گردآوری می‌شود. تا انتشار نخستین مطلب، می‌توانید راهنماهای موجود را در پایگاه دانش ببینید.",
      tr: "Makaleler ve teknik notlar bilgi merkezinde toplanır. İlk yazı yayımlanana kadar mevcut rehberlere bilgi merkezinden ulaşabilirsiniz.",
      en: "Articles and technical notes are collected in the knowledge base. Until the first article is published, you can browse the existing guides there.",
    } satisfies Localized<string>,
    cta: { fa: "ورود به پایگاه دانش", tr: "Bilgi merkezine git", en: "Open the knowledge base" } satisfies Localized<string>,
  },
  abadis: {
    eyebrow: { fa: "کاربردهای پزشکی", tr: "Tıbbi kullanım", en: "Medical use" } satisfies Localized<string>,
    title: {
      fa: "همکاری با آبادیس در کاربردهای پزشکی",
      tr: "Tıbbi kullanımlarda Abadis ile iş birliği",
      en: "Working with Abadis for medical use",
    } satisfies Localized<string>,
    body: {
      fa: "فروش محصولات با کاربرد پزشکی از طریق شرکت آبادیس مد انجام می‌شود.",
      tr: "Tıbbi kullanıma yönelik ürünlerin satışı Abadis Med üzerinden yapılır.",
      en: "Sales of products for medical use go through Abadis Med.",
    } satisfies Localized<string>,
    cta: { fa: "ورود به abadis-med.com", tr: "abadis-med.com’a git", en: "Visit abadis-med.com" } satisfies Localized<string>,
    url: "https://abadis-med.com",
  },
};
