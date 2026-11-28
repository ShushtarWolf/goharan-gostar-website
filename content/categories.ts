import type { Localized } from "@/lib/i18n";

export type CategoryId =
  | "industrial"
  | "medical-devices"
  | "laboratory-filtration"
  | "writing-instruments"
  | "air-care"
  | "water-filtration"
  | "food-and-beverage"
  | "oil-gas"
  | "pva-biodegradable";

export type Category = {
  id: CategoryId;
  name: Localized<string>;
};

export const categories: Category[] = [
  {
    id: "industrial",
    name: { fa: "صنعتی", tr: "Endüstriyel", en: "Industrial" },
  },
  {
    id: "medical-devices",
    name: { fa: "تجهیزات پزشکی", tr: "Tıbbi Cihazlar", en: "Medical Devices" },
  },
  {
    id: "laboratory-filtration",
    name: { fa: "فیلتراسیون آزمایشگاه", tr: "Laboratuvar Filtrasyonu", en: "Laboratory Filtration" },
  },
  {
    id: "writing-instruments",
    name: { fa: "لوازم التحریر", tr: "Yazı Araçları", en: "Writing Instruments" },
  },
  {
    id: "air-care",
    name: { fa: "مراقبت از هوا", tr: "Hava Bakımı", en: "Air Care" },
  },
  {
    id: "water-filtration",
    name: { fa: "فیلتراسیون آب", tr: "Su Filtrasyonu", en: "Water Filtration" },
  },
  {
    id: "food-and-beverage",
    name: { fa: "غذا و نوشیدنی", tr: "Gıda ve İçecek", en: "Food & Beverage" },
  },
  {
    id: "oil-gas",
    name: { fa: "نفت و گاز", tr: "Petrol ve Gaz", en: "Oil & Gas" },
  },
  {
    id: "pva-biodegradable",
    name: {
      fa: "PVA و زیست‌تخریب‌پذیر",
      tr: "PVA ve biyobozunur",
      en: "PVA & Biodegradable",
    },
  },
];
