"use client";

import PageShell from "@/components/layout/PageShell";
import InnerPageHero from "@/components/layout/InnerPageHero";
import PageContent from "@/components/layout/PageContent";
import { typo } from "@/components/layout/typography";
import { ui } from "@/content/ui";
import { t, type Locale, type Localized } from "@/lib/i18n";

const APPS: { title: Localized<string>; body: Localized<string> }[] = [
  {
    title: { fa: "فیلتراسیون", tr: "Filtrasyon", en: "Filtration" },
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

export default function ApplicationsView({ locale }: { locale: Locale }) {
  return (
    <PageShell>
      <InnerPageHero
        eyebrow={ui.brand}
        title={t(ui.nav.applications, locale)}
      />
      <PageContent>
        <div className="space-y-14">
          {APPS.map((a) => (
            <section key={t(a.title, locale)} data-reveal className="text-center">
              <h2 data-typo className={typo.sectionTitle}>
                {t(a.title, locale)}
              </h2>
              <p data-typo className={`mt-4 max-w-2xl mx-auto ${typo.bodyOnDark}`}>
                {t(a.body, locale)}
              </p>
            </section>
          ))}
        </div>
      </PageContent>
    </PageShell>
  );
}