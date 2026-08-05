"use client";

import { createContext, useContext } from "react";
import type { Locale } from "./config";

const LocaleContext = createContext<Locale>("en");

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

/** Client-side hook to read the current storefront language. Server components should use getLocale() instead. */
export function useLocale(): Locale {
  return useContext(LocaleContext);
}
