import { ui } from "@/content/ui";
import { isLocale, t, type Locale, type Localized } from "@/lib/i18n";
import { notFound } from "next/navigation";

const APPS: { title: Localized<string>; body: Localized<string> }[] = [
  {
    title: {
      fa: "فیلتراسیون",
      tr: "Filtrasyon",
      en: "Filtration",
    },
    body: {
      fa: "جداسازی ناخالصی از جریان سیال با حفرات ۱ تا ۲۰۰ میکرون و توزیع یکنواخت.",
      tr: "1–200 µm düzgün gözeneklerle akışkanlardan kirletici ayırma.",
      en: "Separating impurities from fluid flows with uniform 1–200 µm pores.",
    },
  },
  {
    title: { fa: "تخلیه گاز", tr: "Gaz Tahliyesi", en: "Gas Discharge" },
    body: {
      fa: "تخلیه گاز تجمع‌یافته در مخازن و جلوگیری از ورود جرقه و ناخالصی.",
      tr: "Tanklarda biriken gazı tahliye etme; kıvılcım ve kir girişini engelleme.",
      en: "Vent accumulated tank gases while blocking sparks and contaminants.",
    },
  },
  {
    title: { fa: "قطع‌کن", tr: "Akış Durdurma", en: "Stop The Flow" },
    body: {
      fa: "عبور هوا و انسداد با تماس مایع — مانند فیلتر کیسه ساکشن.",
      tr: "Hava geçer, sıvıya değince kapanır — aspirasyon torbası filtresi gibi.",
      en: "Air passes; liquid contact blocks flow — e.g. suction-bag filters.",
    },
  },
  {
    title: { fa: "رهاسازی", tr: "Akış Serbest Bırakma", en: "Release The Flow" },
    body: {
      fa: "نگهداری و رهاسازی کنترل‌شده مایع از حفرات (مانند نوک ماژیک).",
      tr: "Gözeneklerde kontrollü sıvı tutma ve salma (ör. fosforlu uç).",
      en: "Hold and release liquid at a controlled rate (e.g. marker tips).",
    },
  },
  {
    title: { fa: "انتشار", tr: "Dağılım", en: "Dispersion" },
    body: {
      fa: "جذب مایع و انتشار با نرخ ثابت در هوا — خوشبوکننده و حشره‌کش.",
      tr: "Sıvıyı emip sabit hızda havaya salma — oda spreyi ve böcek ilacı.",
      en: "Wick liquid and release at a steady rate into air — fresheners, insecticides.",
    },
  },
  {
    title: { fa: "حباب‌ساز", tr: "Baloncuk / Difüzör", en: "Bubble Blower" },
    body: {
      fa: "تزریق کنترل‌شده گاز به مایع به‌صورت حباب‌های ریز.",
      tr: "Sıvıya kontrollü gaz enjeksiyonu — ince kabarcıklar.",
      en: "Controlled gas injection into liquids as fine bubbles.",
    },
  },
];

export default async function ApplicationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="text-3xl font-semibold text-mist md:text-4xl">
        {t(ui.nav.applications, locale)}
      </h1>
      <div className="mt-10 space-y-10">
        {APPS.map((a) => (
          <section key={t(a.title, locale)}>
            <h2 className="text-xl text-cyan">{t(a.title, locale)}</h2>
            <p className="mt-3 leading-8 text-mist/80">{t(a.body, locale)}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
