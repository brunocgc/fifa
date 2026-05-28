import Link from "next/link";
import { competitions } from "@/lib/competitions";
import { getMessages } from "@/lib/messages";
import { localeLabels, locales } from "@/lib/i18n";
import { Locale } from "@/lib/types";

interface SiteHeaderProps {
  locale: Locale;
}

export function SiteHeader({ locale }: SiteHeaderProps) {
  const messages = getMessages(locale);

  return (
    <header className="topbar">
      <div className="shell topbar__content">
        <Link href={`/${locale}`} className="brand" aria-label={messages.siteTitle}>
          <span className="brand__badge">ge</span>
          <span>
            <strong>{messages.siteTitle}</strong>
            <small>{messages.poweredBy}</small>
          </span>
        </Link>

        <nav className="locale-switcher" aria-label="Languages">
          {locales.map((item) => (
            <Link
              key={item}
              href={`/${item}`}
              className={item === locale ? "locale-switcher__link is-active" : "locale-switcher__link"}
            >
              {localeLabels[item]}
            </Link>
          ))}
        </nav>
      </div>

      <div className="shell competition-strip">
        <span className="section-title">{messages.competitionTitle}</span>
        <div className="competition-strip__list">
          {competitions.map((competition) => (
            <span
              key={competition.slug}
              className={competition.enabled ? "pill pill--active" : "pill"}
              style={{ borderColor: competition.accent }}
            >
              {competition.name}
              {competition.comingSoon ? ` · ${messages.comingSoon}` : ""}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
