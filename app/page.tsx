import { defaultLocale } from "@/lib/i18n";
import { redirect } from "next/navigation";

/** FA is default — send `/` to `/fa/`. */
export default function RootPage() {
  redirect(`/${defaultLocale}/`);
}
