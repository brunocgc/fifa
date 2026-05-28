import { getMessages } from "@/lib/messages";
import { Locale, MatchDetail, Team } from "@/lib/types";

interface TimelineProps {
  locale: Locale;
  match: MatchDetail;
}

function getTeamName(teamId: string, homeTeam: Team, awayTeam: Team) {
  if (teamId === homeTeam.id) {
    return homeTeam.shortName;
  }

  if (teamId === awayTeam.id) {
    return awayTeam.shortName;
  }

  return teamId.toUpperCase();
}

export function Timeline({ locale, match }: TimelineProps) {
  const messages = getMessages(locale);

  return (
    <section className="panel">
      <div className="panel__header">
        <h2>{messages.commentaryTitle}</h2>
      </div>

      <div className="timeline">
        {match.timeline.length ? (
          match.timeline.map((event) => (
            <article key={event.id} className="timeline__item">
              <div className="timeline__minute">{event.minute}</div>
              <div className="timeline__content">
                <span className="timeline__tag">{messages.eventType[event.type]}</span>
                <strong>{event.player}</strong>
                <small>{getTeamName(event.teamId, match.homeTeam, match.awayTeam)}</small>
                <p>{event.description}</p>
              </div>
            </article>
          ))
        ) : (
          <p className="timeline__empty">{messages.noTimeline}</p>
        )}
      </div>
    </section>
  );
}
