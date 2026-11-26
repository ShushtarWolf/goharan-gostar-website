import PageTransition from "@/components/motion/PageTransition";
import type { ReactNode } from "react";

export default function LocaleTemplate({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}