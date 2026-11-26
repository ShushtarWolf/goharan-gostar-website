import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Tailwind max-w-* token without prefix */
  width?: "2xl" | "3xl" | "6xl";
  variant?: "dark" | "soft";
};

export default function PageContent({
  children,
  width = "3xl",
  variant = "dark",
}: Props) {
  const bg = variant === "soft" ? "bg-graphite-soft" : "bg-graphite";
  const maxW =
    width === "6xl"
      ? "max-w-6xl"
      : width === "2xl"
        ? "max-w-2xl"
        : "max-w-3xl";
  return (
    <section className={`relative ${bg} px-6 py-16 md:px-12 md:py-24`}>
      <div className={`mx-auto ${maxW}`}>{children}</div>
    </section>
  );
}