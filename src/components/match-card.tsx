import Link from "next/link";
import { formatDateTime, formatStatus } from "@/lib/format";
import { getMessages } from "@/lib/messages";
import { Locale, MatchSummary } from "@/lib/types";

interface MatchCardProps {
  locale: Locale;
  match: MatchSummary;
}

export function MatchCard({ locale, match }: MatchCardProps) {
  const messages = getMessages(locale);
  const statusText = match.status === "LIVE" && match.minute ? `${formatStatus(match.status, locale)} · ${match.minute}` : formatStatus(match.status, locale);

  return (
    <article className="match-card">
      <div className="match-card__meta">
        <span className={match.status === "LIVE" ? "badge badge--live" : "badge"}>{statusText}</span>
        <span>{match.round}</span>
      </div>

      <div className="match-card__teams">
        <div>
          <strong>{match.homeTeam.name}</strong>
          <small>{match.homeTeam.shortName}</small>
        </div>
        <div className="match-card__score">
          <span>{match.score.home}</span>
          <small>x</small>
          <span>{match.score.away}</span>
        </div>
        <div className="match-card__away">
          <strong>{match.awayTeam.name}</strong>
          <small>{match.awayTeam.shortName}</small>
        </div>
      </div>

      <div className="match-card__footer">
        <span>
          {formatDateTime(match.kickOff, locale)} · {match.venue}
        </span>
        <Link href={`/${locale}/match/${match.id}`} className="text-link">
          {messages.viewDetails}
        </Link>
      </div>
    </article>
  );
}
