import { ui } from "@/content/ui";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <h1 className="text-3xl font-semibold text-mist md:text-4xl">
        {t(ui.contact.title, locale)}
      </h1>
      <div className="mt-8 space-y-4 text-base leading-8 text-mist/80">
        <p>{t(ui.contact.iran, locale)}</p>
        <p>
          Tel:{" "}
          <a className="text-cyan" href={`tel:${ui.contact.phoneIran}`}>
            {ui.contact.phoneIran}
          </a>
        </p>
        <p>{t(ui.contact.turkey, locale)}</p>
        <p>
          Tel:{" "}
          <a className="text-cyan" href={`tel:${ui.contact.phoneTurkey}`}>
            {ui.contact.phoneTurkey}
          </a>
        </p>
        <p>
          Email:{" "}
          <a className="text-cyan" href={`mailto:${ui.contact.email}`}>
            {ui.contact.email}
          </a>
        </p>
      </div>
    </main>
  );
}
