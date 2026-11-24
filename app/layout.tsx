import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GXPORE | گوهران گستر نادین",
  description:
    "گوهران گستر نادین با برند بین‌المللی GXPORE — مهندسی ساختارهای متخلخل پلیمری برای فیلتراسیون، پزشکی و صنعت.",
  icons: {
    icon: "/images/gxpore-logo.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
