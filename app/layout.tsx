import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Vazirmatn } from "next/font/google";
import { asset } from "@/lib/asset";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

/** Industrial display — distinct from body Vazirmatn. */
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "گوهران گستر نادین | GXPORE",
  description:
    "اولین و تخصصی‌ترین تولیدکننده قطعات متخلخل پلیمری در ایران و خاورمیانه",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${plexArabic.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="preload"
          as="image"
          href={asset("/frames/sUOZV/000.webp")}
          type="image/webp"
        />
      </head>
      <body className="min-h-full bg-graphite font-sans text-mist">{children}</body>
    </html>
  );
}
