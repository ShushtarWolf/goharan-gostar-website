import type { Localized } from "@/lib/i18n";

export type FaqItem = { q: Localized<string>; a: Localized<string> };

export type CatalogLink = {
  label: Localized<string>;
  href: string;
};

export const faqItems: FaqItem[] = [
  {
    q: {
      fa: "گوهران گستر چه نوع محصولاتی تولید می‌کند؟",
      en: "What kind of products does Goharan Gostar produce?",
      tr: "Goharan Gostar ne tür ürünler üretir?",
    },
    a: {
      fa: "فیلترهای متخلخل مختلف از ۱ تا ۲۰۰ میکرون در اندازه و اشکال مختلف.",
      en: "Various porous filters in different sizes and shapes ranging from 1 to 200 microns.",
      tr: "1 ila 200 mikron aralığında farklı boyut ve şekillerde gözenekli filtreler.",
    },
  },
  {
    q: {
      fa: "فیلترهای متخلخل گوهران گستر چه کاربردی دارند؟",
      en: "What are Goharan Gostar porous filters used for?",
      tr: "Goharan Gostar gözenekli filtreler nerelerde kullanılır?",
    },
    a: {
      fa: "هرجا که نیاز به جداسازی مایع از مایع، مایع از جامد، مایع از گاز، یا جامد از گاز باشد می‌توان از فیلترهای متخلخل گوهران گستر استفاده کرد.",
      en: "They can be used wherever separation of liquid from liquid, liquid from solid, liquid from gas, or solid from gas is needed.",
      tr: "Sıvı-sıvı, sıvı-katı, sıvı-gaz veya katı-gaz ayrımı gereken her yerde kullanılabilir.",
    },
  },
  {
    q: {
      fa: "فیلترهای متخلخل گوهران گستر در چه صنایعی کاربرد دارد؟",
      en: "What industries use Goharan Gostar porous filters?",
      tr: "Goharan Gostar gözenekli filtreleri hangi sektörler kullanır?",
    },
    a: {
      fa: "تقریباً در بیشتر صنایع از این فیلترها استفاده می‌شود؛ از جمله تجهیزات پزشکی، داروسازی، نفت و گاز، تصفیه آب، لبنیات و صنایع شیمیایی.",
      en: "These filters are used in almost all industries, including medical equipment, pharmaceuticals, oil and gas, water purification, dairy products, and the chemical industry.",
      tr: "Tıbbi cihazlar, ilaç, petrol-gaz, su arıtma, süt ürünleri ve kimya dahil birçok sektörde kullanılır.",
    },
  },
];

export const aboutParagraphs: Localized<string[]> = {
  fa: [
    "شرکت گوهران گستر نادین مجموعه‌ای از مهندسان متخصص در حوزه غشا و فیلتر است که با دانش روز و فناوری‌های نوین، بهترین راه‌حل‌ها و تجربه را برای مشتریان می‌سازد.",
    "تمرکز ما همیشه بر خلق ارزش و بهبود مستمر محصولات است. کارشناسان گوهران فرایندها و بازخوردها را بررسی می‌کنند تا نیازهای مشتری را تحلیل کرده و مؤثرترین راه‌حل را انتخاب کنند.",
    "رضایت حداکثری مشتریان و روابط بلندمدت، افتخار و هدف نهایی ماست.",
  ],
  en: [
    "Goharan Gostar Nadin Company is a group of specialized engineers in the field of membranes and filters that constantly strive to provide the most effective solutions, achieve the most efficient results, and create the best experience for their customers by utilizing up-to-date knowledge and innovative technologies because they are our most valuable asset and highest priority.",
    "Our focus is always on value creation and continuous improvement of our products. To this end, Goharan experts carefully examine all processes and feedback to identify customers' challenges, problems, and needs and choose the best and most effective solutions through proper analysis and planning.",
    "Our ultimate goal and honor are maximum customer satisfaction and long-term relationships.",
  ],
  tr: [
    "Goharan Gostar Nadin, membran ve filtre alanında uzman mühendislerden oluşan bir ekiptir; güncel bilgi ve yenilikçi teknolojilerle en etkili çözümleri sunar.",
    "Odağımız her zaman değer yaratmak ve ürünleri sürekli iyileştirmektir.",
    "Nihai hedefimiz maksimum müşteri memnuniyeti ve uzun vadeli ilişkilerdir.",
  ],
};

export const responsibilityNote: Localized<string> = {
  fa: "محتوای صفحهٔ مسئولیت اجتماعی در نسخهٔ فارسی وب‌سایت رسمی در حال حاضر خالی است. [TODO: تکمیل از سمت کارفرما]",
  en: "The official Our Responsibility page currently has no body copy on the source site. [TODO: client content]",
  tr: "Resmî sitede Sorumluluğumuz sayfasının gövde metni şu an boş. [TODO: müşteri içeriği]",
};

export const careerNote: Localized<string> = {
  fa: "فرصت‌های شغلی: رزومهٔ خود را به‌صورت PDF به info@goharangostar.com ارسال کنید یا از طریق صفحه تماس با ما در ارتباط باشید.",
  en: "Career opportunities: send your resume as a PDF to info@goharangostar.com or reach us through the contact page.",
  tr: "Kariyer: PDF özgeçmişinizi info@goharangostar.com adresine gönderin veya iletişim sayfasını kullanın.",
};

export const catalogIntro: Localized<string> = {
  fa: "برای اطلاعات بیشتر کاتالوگ‌های زیر را دانلود کنید.",
  en: "For more information please download the following catalogs.",
  tr: "Daha fazla bilgi için aşağıdaki katalogları indirin.",
};

export const catalogs: CatalogLink[] = [
  {
    label: {
      fa: "کاتالوگ گوهران گستر (فارسی)",
      en: "Goharan Gostar Catalog (Persian)",
      tr: "Goharan Gostar Kataloğu (Farsça)",
    },
    href: "https://goharangostar.com/wp-content/uploads/2024/01/Goharan-Gostar-Catalog-FA.pdf",
  },
];

/** EN-only on source site — FA copy TODO when WPML page is published. */
export const porousPlasticSections: {
  title: Localized<string>;
  body: Localized<string>;
}[] = [
  {
    title: { fa: "معرفی", en: "Introduction", tr: "Giriş" },
    body: {
      fa: "[TODO: ترجمه رسمی از صفحه Sintered Porous Plastic] مواد پلیمری متخلخل با ساختار منافذ به‌هم‌پیوسته در فیلتراسیون، تجهیزات پزشکی و سامانه‌های صنعتی کاربرد گسترده دارند.",
      en: "Porous plastic, a remarkable class of materials, have garnered attention for their distinctive characteristics and multifaceted applications. Engineered with a porous structure comprising interconnected voids, these materials possess properties that render them invaluable across diverse industries.",
      tr: "Gözenekli plastikler, birbirine bağlı boşluklardan oluşan yapılarıyla çeşitli endüstrilerde değerli malzemelerdir.",
    },
  },
  {
    title: { fa: "تخلخل و منافذ", en: "Porosity and pores", tr: "Gözeneklilik" },
    body: {
      fa: "[TODO] اندازه، توزیع و هندسه منافذ عملکرد نهایی را تعیین می‌کند.",
      en: "Porosity denotes the volume percentage of void spaces within the material. Pore size dictates what can permeate the material; pore distribution affects uniformity in fluid flow.",
      tr: "Gözenek boyutu ve dağılımı akışkan davranışını belirler.",
    },
  },
];