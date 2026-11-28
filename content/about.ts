import type { Localized } from "@/lib/i18n";

/** About page copy. FA is the client's text (msg 275), verbatim except «جهام» fixed to «جهان». */
type AboutSection = {
  id: string;
  title: Localized<string>;
  paragraphs?: Localized<string[]>;
  bullets?: Localized<string[]>;
};

export const aboutPage: {
  intro: Localized<string[]>;
  sections: AboutSection[];
} = {
  intro: {
    fa: [
      "شرکت دانش‌بنیان گوهران گستر نادین با برند بین‌المللی GXPORE، نخستین تولیدکنندهٔ تخصصی فیلترهای پلیمری متخلخل و فیلم‌های محلول در آب پلی‌وینیل الکل (PVA) در غرب آسیاست. با دستیابی به دانش فنی ساخت این دسته از فیلترهای پلیمری متخلخل، ایران به چهارمین کشور تولیدکنندهٔ این محصولات در جهان تبدیل شده است.",
      "GXPORE با تکیه بر تخصص مهندسان خود در حوزهٔ غشا، فیلتراسیون و مهندسی پلیمر، هر محصول را متناسب با شرایط کاربرد آن طراحی می‌کند. در قطعات متخلخل، مهندسی اندازهٔ حفره‌ها در بازهٔ ۱ تا ۲۰۰ میکرون امکان عبور انتخابی و جداسازی ناخالصی‌ها را فراهم می‌کند. در فیلم‌های PVA نیز ضخامت، دما و سرعت انحلال متناسب با نیاز هر کاربرد تنظیم می‌شود. بازخورد مشتریان و ارزیابی عملکرد محصولات، مبنای بهبود مستمر طراحی و فرایند تولید در GXPORE است.",
    ],
    tr: [
      "Bilgi tabanlı bir şirket olan Goharan Gostar Nadin, uluslararası GXPORE markasıyla Batı Asya’da gözenekli polimer filtrelerin ve suda çözünen polivinil alkol (PVA) filmlerin ilk uzman üreticisidir. Bu tür gözenekli polimer filtrelerin üretim bilgisine ulaşarak İran, bu ürünleri üreten dünyadaki dördüncü ülke olmuştur.",
      "GXPORE, membran, filtrasyon ve polimer mühendisliği alanındaki mühendislerinin uzmanlığına dayanarak her ürünü kullanım koşullarına göre tasarlar. Gözenekli parçalarda, gözenek boyutunun 1 ila 200 mikron aralığında mühendislikle tasarlanması seçici geçişi ve safsızlıkların ayrılmasını sağlar. PVA filmlerde de kalınlık, sıcaklık ve çözünme hızı her uygulamanın ihtiyacına göre ayarlanır. Müşteri geri bildirimleri ve ürün performansının değerlendirilmesi, GXPORE’da tasarım ve üretim sürecinin sürekli iyileştirilmesinin temelidir.",
    ],
    en: [
      "Goharan Gostar Nadin, a knowledge-based company with the international GXPORE brand, is the first specialized producer of porous polymer filters and water-soluble polyvinyl alcohol (PVA) films in West Asia. By achieving the technical know-how to manufacture this class of porous polymer filters, Iran has become the fourth country in the world to produce these products.",
      "Relying on the expertise of its engineers in membranes, filtration, and polymer engineering, GXPORE designs each product to suit the conditions of its application. In porous parts, engineering the pore size in the range of 1 to 200 microns enables selective passage and the separation of impurities. In PVA films, thickness, temperature, and dissolution speed are likewise tuned to the needs of each application. Customer feedback and product performance evaluation are the basis for the continuous improvement of design and production processes at GXPORE.",
    ],
  } satisfies Localized<string[]>,
  sections: [
    {
      id: "mission",
      title: { fa: "مأموریت", tr: "Misyon", en: "Mission" } satisfies Localized<string>,
      paragraphs: {
        fa: [
          "مأموریت GXPORE توسعه و تولید فیلترها، قطعات پلیمری متخلخل و فیلم‌های محلول در آب متناسب با نیاز صنایع است. تیم GXPORE از شناخت مسئله و طراحی محصول تا ارزیابی عملکرد آن در شرایط واقعی، در کنار مشتری می‌ماند تا زمینهٔ همکاری بلندمدت شکل بگیرد.",
        ],
        tr: [
          "GXPORE’un misyonu, sanayinin ihtiyaçlarına uygun filtreler, gözenekli polimer parçalar ve suda çözünen filmler geliştirmek ve üretmektir. GXPORE ekibi, sorunun anlaşılmasından ürün tasarımına ve ürünün gerçek koşullardaki performansının değerlendirilmesine kadar müşterinin yanında kalır; böylece uzun vadeli iş birliğinin zemini oluşur.",
        ],
        en: [
          "GXPORE’s mission is to develop and produce filters, porous polymer parts, and water-soluble films that suit the needs of industry. From understanding the problem and designing the product to evaluating its performance in real conditions, the GXPORE team stays alongside the customer so that the ground for long-term cooperation is formed.",
        ],
      } satisfies Localized<string[]>,
    },
    {
      id: "vision",
      title: { fa: "چشم‌انداز", tr: "Vizyon", en: "Vision" } satisfies Localized<string>,
      paragraphs: {
        fa: [
          "GXPORE در پی آن است که به یکی از مراجع توسعهٔ فناوری مواد پلیمری متخلخل و فیلم‌های محلول در آب در غرب آسیا و تأمین‌کننده‌ای قابل‌اتکا در بازارهای بین‌المللی تبدیل شود. حرکت در لبهٔ فناوری و تبدیل دستاوردهای تحقیق‌وتوسعه به محصولاتی با کیفیت پایدار در مقیاس صنعتی، مسیر دستیابی به این چشم‌انداز است.",
        ],
        tr: [
          "GXPORE, Batı Asya’da gözenekli polimer malzemeler ve suda çözünen filmler teknolojisinin gelişiminde başvuru kaynaklarından biri ve uluslararası pazarlarda güvenilir bir tedarikçi olmayı hedefler. Teknolojinin sınırında ilerlemek ve Ar-Ge çıktılarını endüstriyel ölçekte kalıcı kaliteye sahip ürünlere dönüştürmek, bu vizyona giden yoldur.",
        ],
        en: [
          "GXPORE aims to become one of the reference points for the development of porous polymer material and water-soluble film technology in West Asia and a dependable supplier in international markets. Moving at the edge of technology and turning R&D achievements into products of consistent quality at industrial scale is the path to this vision.",
        ],
      } satisfies Localized<string[]>,
    },
    {
      id: "technologies",
      title: {
        fa: "فناوری‌ها و دانش فنی",
        tr: "Teknolojiler ve bilgi birikimi",
        en: "Technologies and know-how",
      } satisfies Localized<string>,
      bullets: {
        fa: [
          "سینترینگ برای تولید قطعات پلیمری متخلخل با ساختار و اندازهٔ حفرهٔ متناسب با کاربرد",
          "کستینگ برای تولید فیلم‌های محلول در آب با ضخامت کنترل‌شده",
          "کامپاندینگ برای ترکیب پلیمرها و افزودنی‌ها و دستیابی به خواص موردنیاز ماده",
          "فرمولاسیون برای تنظیم ویژگی‌هایی مانند عبورپذیری قطعات متخلخل و سرعت انحلال فیلم‌های PVA",
        ],
        tr: [
          "Yapısı ve gözenek boyutu uygulamaya uygun gözenekli polimer parçaların üretimi için sinterleme",
          "Kalınlığı kontrollü suda çözünen filmlerin üretimi için döküm (casting)",
          "Polimerleri ve katkıları birleştirmek ve malzemenin gereken özelliklerine ulaşmak için kompaundlama",
          "Gözenekli parçaların geçirgenliği ve PVA filmlerin çözünme hızı gibi özellikleri ayarlamak için formülasyon",
        ],
        en: [
          "Sintering to produce porous polymer parts with a structure and pore size matched to the application",
          "Casting to produce water-soluble films with controlled thickness",
          "Compounding to combine polymers and additives and reach the required material properties",
          "Formulation to adjust properties such as the permeability of porous parts and the dissolution speed of PVA films",
        ],
      } satisfies Localized<string[]>,
    },
    {
      id: "industries",
      title: {
        fa: "صنایع و حوزه‌های کاربرد",
        tr: "Sektörler ve uygulama alanları",
        en: "Industries and applications",
      } satisfies Localized<string>,
      paragraphs: {
        fa: [
          "محصولات GXPORE برای کاربردهای متنوع در تجهیزات پزشکی، نفت و گاز، غذا و نوشیدنی، تجهیزات آزمایشگاهی، سامانه‌های صنعتی، نساجی و محصولات آرایشی و بهداشتی طراحی و تولید می‌شوند.",
        ],
        tr: [
          "GXPORE ürünleri; tıbbi ekipman, petrol ve gaz, gıda ve içecek, laboratuvar ekipmanı, endüstriyel sistemler, tekstil ile kozmetik ve kişisel bakım ürünlerindeki çeşitli uygulamalar için tasarlanır ve üretilir.",
        ],
        en: [
          "GXPORE products are designed and manufactured for diverse applications in medical equipment, oil and gas, food and beverage, laboratory equipment, industrial systems, textiles, and cosmetic and hygiene products.",
        ],
      } satisfies Localized<string[]>,
    },
    {
      id: "team",
      title: { fa: "تخصص تیم", tr: "Ekibin uzmanlığı", en: "Team expertise" } satisfies Localized<string>,
      paragraphs: {
        fa: [
          "تیم GXPORE از نخبگان و متخصصان مهندسی پلیمر، غشا و فیلتراسیون، طراحی فرایند، تولید و کنترل کیفیت تشکیل شده است. اعضای تیم از تحلیل نیاز مشتری و انتخاب مواد تا نمونه‌سازی، ارزیابی عملکرد و تولید صنعتی با یکدیگر همکاری می‌کنند. این همکاری به GXPORE امکان می‌دهد دانش فنی خود را بر اساس نیازهای واقعی صنایع توسعه دهد.",
        ],
        tr: [
          "GXPORE ekibi; polimer mühendisliği, membran ve filtrasyon, proses tasarımı, üretim ve kalite kontrol alanlarındaki seçkin uzmanlardan oluşur. Ekip üyeleri, müşteri ihtiyacının analizinden malzeme seçimine, numune hazırlamadan performans değerlendirmeye ve endüstriyel üretime kadar birlikte çalışır. Bu iş birliği, GXPORE’un teknik bilgisini sanayinin gerçek ihtiyaçlarına göre geliştirmesini sağlar.",
        ],
        en: [
          "The GXPORE team is made up of leading experts in polymer engineering, membranes and filtration, process design, production, and quality control. Team members work together from analyzing customer needs and selecting materials to prototyping, performance evaluation, and industrial production. This cooperation allows GXPORE to develop its technical know-how based on the real needs of industry.",
        ],
      } satisfies Localized<string[]>,
    },
    {
      id: "ceo-message",
      title: { fa: "پیام مدیرعامل", tr: "Genel müdürün mesajı", en: "Message from the CEO" } satisfies Localized<string>,
      paragraphs: {
        fa: [
          "در GXPORE، طراحی هر محصول با یک پرسش آغاز می‌شود. این محصول در شرایط واقعی باید چه کاری انجام دهد؟ پاسخ این پرسش مشخص می‌کند که حفره‌های یک فیلتر چه اندازه‌ای داشته باشند یا یک فیلم محلول در آب با چه سرعتی حل شود. مسئولیت ما این است که این نیازها را به محصولی با عملکرد دقیق و قابل‌اتکا تبدیل کنیم.",
          "اعتماد مشتریان را حاصل کیفیت پایدار، پاسخ‌گویی و پایبندی به تعهداتمان می‌دانیم. با تکیه بر دانش و توان تیم GXPORE، به توسعهٔ فناوری و بهبود محصولات ادامه می‌دهیم تا این اعتماد، پایهٔ همکاری‌های بلندمدت ما در ایران و بازارهای بین‌المللی باشد.",
        ],
        tr: [
          "GXPORE’da her ürünün tasarımı bir soruyla başlar: Bu ürün gerçek koşullarda ne yapmalıdır? Bu sorunun cevabı, bir filtrenin gözeneklerinin ne boyutta olacağını ya da suda çözünen bir filmin ne hızla çözüneceğini belirler. Sorumluluğumuz, bu ihtiyaçları hassas ve güvenilir performansa sahip bir ürüne dönüştürmektir.",
          "Müşteri güvenini; sürdürülebilir kalitenin, duyarlılığın ve taahhütlerimize bağlılığın sonucu olarak görüyoruz. GXPORE ekibinin bilgisi ve gücüne dayanarak teknolojiyi geliştirmeye ve ürünleri iyileştirmeye devam ediyoruz; böylece bu güven, İran’da ve uluslararası pazarlardaki uzun vadeli iş birliklerimizin temeli olur.",
        ],
        en: [
          "At GXPORE, the design of every product starts with one question: what must this product do in real conditions? The answer determines how large the pores of a filter should be, or how fast a water-soluble film should dissolve. Our responsibility is to turn these needs into a product with precise and dependable performance.",
          "We regard customer trust as the result of consistent quality, responsiveness, and keeping our commitments. Relying on the knowledge and capability of the GXPORE team, we continue to develop technology and improve our products so that this trust is the foundation of our long-term cooperation in Iran and in international markets.",
        ],
      } satisfies Localized<string[]>,
    },
  ],
};
