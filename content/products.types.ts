import type { CategoryId } from "@/content/categories";
import type { IndustryId } from "@/content/industries";
import type { Localized } from "@/lib/i18n";

export type SpecsStatus = "ok" | "partial" | "placeholder" | "none";

export type Product = {
  slug: string;
  category: CategoryId;
  industries: IndustryId[];
  /** Homepage scene folder id, if this product group appears after a scrub scene */
  homeScene?: "silencer" | "pipette" | "medical";
  name: Localized<string>;
  intro: Localized<string>;
  body?: Localized<string[]>;
  features: Localized<string[]>;
  images?: string[];
  /** Markdown-ish table rows: first row = headers */
  specsTable: Localized<string[][]> | null;
  specsStatus: SpecsStatus;
  wpPath: { fa?: string; en?: string; tr?: string };
};