import Link from "next/link";
import { Timeline } from "@/components/timeline";
import { formatLongDateTime, formatStatus } from "@/lib/format";
import { getCompetitionSnapshot, getMatchDetail } from "@/lib/fifa";
import { isLocale, locales } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export async function generateStaticParams() {
  const snapshot = await getCompetitionSnapshot();

  return locales.flatMap((locale) =>
    snapshot.matches.map((match) => ({
      locale,
      matchId: match.id,
    })),
  );
}

export default async function MatchPage({
  params,
}: {
  params: Promise<{ locale: string; matchId: string }>;
}) {
  const { locale, matchId } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = getMessages(locale);
  const { detail, dataSource } = await getMatchDetail(matchId);

  if (!detail) {
    notFound();
  }

  return (
    <main className="shell page page--detail">
      <Link href={`/${locale}`} className="back-link">
        ← {messages.matchesTitle}
      </Link>

      <section className="detail-hero">
        <div>
          <span className={detail.status === "LIVE" ? "badge badge--live" : "badge"}>
            {formatStatus(detail.status, locale)}
            {detail.minute ? ` · ${detail.minute}` : ""}
          </span>
          <h1>{messages.matchCenter}</h1>
          <p>{detail.headline}</p>
        </div>

        <div className="detail-scoreboard">
          <strong>{detail.homeTeam.name}</strong>
          <div className="detail-scoreboard__score">
            <span>{detail.score.home}</span>
            <small>x</small>
            <span>{detail.score.away}</span>
          </div>
          <strong>{detail.awayTeam.name}</strong>
        </div>
      </section>

      <section className="detail-grid">
        <article className="panel detail-summary">
          <div className="panel__header">
            <h2>{messages.summary}</h2>
            <span>
              {messages.sourceLabel}: {dataSource === "fifa" ? messages.sourceFifa : messages.sourceFallback}
            </span>
          </div>
          <p>{detail.summary}</p>
          <dl className="facts-grid">
            <div>
              <dt>{messages.venue}</dt>
              <dd>{detail.venue}</dd>
            </div>
            <div>
              <dt>{messages.referee}</dt>
              <dd>{detail.referee}</dd>
            </div>
            <div>
              <dt>{messages.attendance}</dt>
              <dd>{detail.attendance}</dd>
            </div>
            <div>
              <dt>{messages.updatedAt}</dt>
              <dd>{formatLongDateTime(detail.kickOff, locale)}</dd>
            </div>
          </dl>
        </article>

        <article className="panel detail-stats">
          <div className="panel__header">
            <h2>{messages.stats}</h2>
          </div>
          <div className="stats-list">
            {detail.stats.map((stat) => (
              <div key={stat.label} className="stats-list__item">
                <strong>{stat.home}</strong>
                <span>{stat.label}</span>
                <strong>{stat.away}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <Timeline locale={locale} match={detail} />
    </main>
  );
}
