import type { Metadata } from "next";
import { asset } from "@/lib/asset";
import { inter, kalameh } from "@/lib/fonts";
import "./globals.css";

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
      className={`${kalameh.variable} ${inter.variable} h-full antialiased`}
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
