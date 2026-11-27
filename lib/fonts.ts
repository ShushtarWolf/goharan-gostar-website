import localFont from "next/font/local";
import { Inter } from "next/font/google";

/**
 * Kalameh (FaNum) — same family as the Abadis Med site.
 * Weights map 400–900 to Regular, Medium, SemiBold, Bold, ExtraBold, Black.
 * FaNum renders Latin 0–9 as Persian digits, which is correct for /fa/.
 */
export const kalameh = localFont({
  src: [
    {
      path: "../fonts/kalameh/KalamehWeb-FaNum-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/kalameh/KalamehWeb-FaNum-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/kalameh/KalamehWeb-FaNum-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/kalameh/KalamehWeb-FaNum-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/kalameh/KalamehWeb-FaNum-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../fonts/kalameh/KalamehWeb-FaNum-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-kalameh",
  display: "swap",
  preload: true,
  adjustFontFallback: false,
});

/** Latin (and Latin digits) for /en/ and /tr/, and mixed Latin on FA pages. */
export const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-latin",
  display: "swap",
});
