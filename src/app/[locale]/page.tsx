import { MatchCard } from "@/components/match-card";
import { StandingsTable } from "@/components/standings-table";
import { formatLongDateTime } from "@/lib/format";
import { getCompetitionSnapshot } from "@/lib/fifa";
import { isLocale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { notFound } from "next/navigation";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = getMessages(locale);
  const snapshot = await getCompetitionSnapshot();
  const liveMatch = snapshot.matches.find((match) => match.status === "LIVE") ?? snapshot.matches[0];

  return (
    <main className="shell page">
      <section className="hero">
        <div>
          <span className="hero__kicker">{messages.heroKicker}</span>
          <h1>{messages.siteTitle}</h1>
          <p>{messages.siteSubtitle}</p>
          <p className="hero__description">{messages.heroDescription}</p>
        </div>

        <aside className="scoreboard-card">
          <small>{messages.scoreboardLabel}</small>
          <div className="scoreboard-card__score">
            <strong>{liveMatch.homeTeam.shortName}</strong>
            <span>{liveMatch.score.home}</span>
            <em>x</em>
            <span>{liveMatch.score.away}</span>
            <strong>{liveMatch.awayTeam.shortName}</strong>
          </div>
          <p>
            {messages.liveNow}: {liveMatch.round} · {liveMatch.minute ?? formatLongDateTime(liveMatch.kickOff, locale)}
          </p>
          <div className="hero__meta">
            <span>
              {messages.sourceLabel}: {snapshot.dataSource === "fifa" ? messages.sourceFifa : messages.sourceFallback}
            </span>
            <span>
              {messages.updatedAt}: {formatLongDateTime(snapshot.updatedAt, locale)}
            </span>
          </div>
          {snapshot.dataSource === "static" ? <p className="hint">{messages.fallbackData}</p> : null}
        </aside>
      </section>

      <section className="content-grid">
        <StandingsTable locale={locale} standings={snapshot.standings} />

        <section className="panel">
          <div className="panel__header">
            <h2>{messages.matchesTitle}</h2>
          </div>
          <div className="matches-list">
            {snapshot.matches.map((match) => (
              <MatchCard key={match.id} locale={locale} match={match} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
