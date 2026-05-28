import { intlLocales } from "@/lib/i18n";
import { Locale, MatchStatus } from "@/lib/types";
import { getMessages } from "@/lib/messages";

export function formatDateTime(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocales[locale], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatLongDateTime(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocales[locale], {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatStatus(status: MatchStatus, locale: Locale) {
  return getMessages(locale).status[status];
}
