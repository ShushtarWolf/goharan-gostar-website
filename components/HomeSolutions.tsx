"use client";

import { useEffect, useState } from "react";
import { homeCopy } from "@/content/home";
import { productsForHomeScene } from "@/content/products";
import { href } from "@/lib/paths";
import { t, type Locale } from "@/lib/i18n";
import { typo } from "@/components/layout/typography";

type TabId = "departments" | "applications";

/**
 * "Our solutions": two-box switcher (departments / applications),
 * same idea as the Abadis "by product / by solution" switcher.
 * Medical products formerly shown in the separate medical scene sit under Medical equipment.
 */
export default function HomeSolutions({ locale }: { locale: Locale }) {
  const [tab, setTab] = useState<TabId>("departments");
  useEffect(() => {
    const apply = () => {
      const h = window.location.hash.replace("#", "");
      if (h !== "solutions" && h !== "solutions-applications") return;
      setTab(h === "solutions-applications" ? "applications" : "departments");
      window.setTimeout(() => {
        document.getElementById("solutions")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 350);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const medicalProducts = productsForHomeScene("medical");

  const tabs: { id: TabId; label: string }[] = [
    { id: "departments", label: t(homeCopy.solutionsTabs.departments, locale) },
    { id: "applications", label: t(homeCopy.solutionsTabs.applications, locale) },
  ];

  const rowClass =
    "group flex items-center justify-between gap-4 border-t border-white/10 py-5 text-lg font-medium text-mist transition hover:text-cyan md:py-6 md:text-2xl";

  return (
    <section
      id="solutions"
      className={`relative bg-graphite ${typo.sectionX} py-24 md:py-32`}
    >
      <div className="mx-auto max-w-3xl">
        <h2 data-typo className={`text-center ${typo.sectionTitle}`}>
          {t(homeCopy.solutionsTitle, locale)}
        </h2>

        <div
          role="tablist"
          aria-label={t(homeCopy.solutionsTitle, locale)}
          className={`${typo.stackXl} grid grid-cols-2 gap-3`}
        >
          {tabs.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`solutions-tab-${item.id}`}
                aria-selected={active}
                aria-controls={`solutions-panel-${item.id}`}
                onClick={() => setTab(item.id)}
                className={`rounded-full border px-4 py-3 text-sm font-medium transition md:text-base ${
                  active
                    ? "border-cyan bg-cyan/10 text-cyan"
                    : "border-white/15 text-mist/65 hover:border-cyan/50 hover:text-mist"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id="solutions-panel-departments"
          aria-labelledby="solutions-tab-departments"
          hidden={tab !== "departments"}
          className={typo.stackLg}
        >
          <ul>
            {homeCopy.solutionsDepartments.map((d) => (
              <li key={d.id}>
                <a href={`${href(locale, d.path)}${"hash" in d ? `#${d.hash}` : ""}`} className={rowClass}>
                  <span>{t(d.title, locale)}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div
          role="tabpanel"
          id="solutions-panel-applications"
          aria-labelledby="solutions-tab-applications"
          hidden={tab !== "applications"}
          className={typo.stackLg}
        >
          <ul>
            {homeCopy.solutionsApplications.map((a) => (
              <li key={a.id}>
                <a href={`${href(locale, "products")}#${a.id}`} className={rowClass}>
                  <span>{t(a.title, locale)}</span>
                </a>
                {a.id === "medical-devices" && medicalProducts.length > 0 ? (
                  <ul className="mb-4 ps-4 md:ps-6">
                    {medicalProducts.map((p) => (
                      <li key={p.slug}>
                        <a
                          href={href(locale, `products/${p.slug}`)}
                          className="block py-2 text-base text-mist/65 transition hover:text-cyan md:text-lg"
                        >
                          {t(p.name, locale)}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
