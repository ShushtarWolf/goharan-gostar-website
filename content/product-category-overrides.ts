import type { CategoryId } from "@/content/categories";

/** Catalog entries that need an explicit products-page category beyond industry mapping. */
export const productCategoryOverrides: Partial<Record<string, CategoryId>> = {
  "nonalcoholic-beverage-filtration": "food-and-beverage",
  "juice-filtration": "food-and-beverage",
};