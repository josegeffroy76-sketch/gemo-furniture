import type { Locale } from "./config";
import type { CategoryRecord } from "../types";

/**
 * Spanish label/blurb for the 7 starter categories (src/lib/categories.ts).
 * Admin-added or admin-renamed categories aren't in this map and simply
 * fall back to whatever text the admin entered — see localizeCategory().
 */
const CATEGORY_TRANSLATIONS_ES: Record<string, { label: string; blurb: string }> = {
  "sofas-sectionals": {
    label: "Sofás y Seccionales",
    blurb: "Asientos compactos, pensados para apartamentos y salas pequeñas.",
  },
  "sofa-beds": {
    label: "Sofás Cama",
    blurb: "Cómodos de día, una cama real de noche — perfectos para visitas y estudios.",
  },
  bedroom: {
    label: "Camas y Recámara",
    blurb: "Estructuras de cama y almacenaje que aprovechan el espacio en dormitorios y cuartos pequeños.",
  },
  storage: {
    label: "Almacenaje y Organización",
    blurb: "Soluciones de almacenaje que hacen sentir más grandes los hogares pequeños.",
  },
  dining: {
    label: "Comedor para Espacios Pequeños",
    blurb: "Sets de comedor compactos y plegables para apartamentos y estudios.",
  },
  "home-office": {
    label: "Oficina en Casa",
    blurb: "Escritorios y asientos que caben en una esquina, no en un cuarto extra.",
  },
  "accent-decor": {
    label: "Acentos y Decoración",
    blurb: "Los toques finales que hacen sentir un primer apartamento como hogar.",
  },
};

export function localizeCategory<T extends CategoryRecord>(category: T, locale: Locale): T {
  if (locale === "en") return category;
  const tr = CATEGORY_TRANSLATIONS_ES[category.slug];
  if (!tr) return category;
  return { ...category, label: tr.label, blurb: tr.blurb };
}

export function localizeCategories<T extends CategoryRecord>(categories: T[], locale: Locale): T[] {
  return categories.map((c) => localizeCategory(c, locale));
}
