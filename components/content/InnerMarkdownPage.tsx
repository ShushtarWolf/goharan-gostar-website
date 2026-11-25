"use client";

import PageShell from "@/components/layout/PageShell";
import InnerPageHero from "@/components/layout/InnerPageHero";
import PageContent from "@/components/layout/PageContent";
import { typo } from "@/components/layout/typography";
import type { ReactNode } from "react";

type Props = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  children: ReactNode;
  width?: "2xl" | "3xl" | "6xl";
};

export default function InnerMarkdownPage({
  title,
  eyebrow,
  subtitle,
  children,
  width = "3xl",
}: Props) {
  return (
    <PageShell>
      <InnerPageHero title={title} eyebrow={eyebrow} subtitle={subtitle} />
      <PageContent width={width}>
        <div className={`space-y-6 ${typo.bodyOnDarkSm}`}>{children}</div>
      </PageContent>
    </PageShell>
  );
}