import { Locale } from "@/lib/types";

export const locales: Locale[] = ["pt", "en", "es"];
export const defaultLocale: Locale = "pt";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const localeLabels: Record<Locale, string> = {
  pt: "PT",
  en: "EN",
  es: "ES",
};

export const intlLocales: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES",
};
