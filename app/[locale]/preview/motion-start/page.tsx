import HomeExperience from "@/components/HomeExperience";
import MotionPreviewBanner from "@/components/MotionPreviewBanner";
import { isLocale, type Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "پیش‌نمایش حرکت متن | GXPORE",
  robots: { index: false, follow: false },
};

export default async function MotionPreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  return (
    <>
      <MotionPreviewBanner locale={locale} mode="start" />
      <HomeExperience locale={locale} motionMode="start" />
    </>
  );
}
