import { getMessages } from "@/lib/messages";
import { Locale, StandingRow } from "@/lib/types";

interface StandingsTableProps {
  locale: Locale;
  standings: StandingRow[];
}

export function StandingsTable({ locale, standings }: StandingsTableProps) {
  const messages = getMessages(locale);
  const headers = messages.tableHeaders;

  return (
    <section className="panel">
      <div className="panel__header">
        <h2>{messages.standingsTitle}</h2>
      </div>

      <div className="table-wrap">
        <table className="standings-table">
          <thead>
            <tr>
              <th>{headers.position}</th>
              <th>{headers.club}</th>
              <th>{headers.pts}</th>
              <th>{headers.played}</th>
              <th>{headers.won}</th>
              <th>{headers.drawn}</th>
              <th>{headers.lost}</th>
              <th>{headers.gd}</th>
              <th>{messages.form}</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row) => (
              <tr key={row.team.id}>
                <td>{row.position}</td>
                <td>
                  <div className="club-cell">
                    <span className="club-cell__crest">{row.team.code}</span>
                    <span>{row.team.name}</span>
                  </div>
                </td>
                <td>{row.points}</td>
                <td>{row.played}</td>
                <td>{row.won}</td>
                <td>{row.drawn}</td>
                <td>{row.lost}</td>
                <td>{row.goalsFor - row.goalsAgainst}</td>
                <td>
                  <div className="form-strip">
                    {row.form.map((item, index) => (
                      <span
                        key={`${row.team.id}-${index}`}
                        className={item === "W" ? "form-strip__item is-win" : item === "D" ? "form-strip__item is-draw" : "form-strip__item is-loss"}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
