import HomeExperience from "@/components/HomeExperience";
import { isLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  return <HomeExperience locale={raw as Locale} />;
}
