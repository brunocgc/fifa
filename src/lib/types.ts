export type Locale = "pt" | "en" | "es";

export type MatchStatus = "LIVE" | "FINISHED" | "UPCOMING";
export type MatchEventType = "goal" | "card" | "substitution" | "var" | "penalty";
export type DataSource = "fifa" | "fallback";

export interface Team {
  id: string;
  name: string;
  shortName: string;
  code: string;
}

export interface Competition {
  slug: string;
  name: string;
  season: string;
  region: string;
  accent: string;
  enabled: boolean;
  comingSoon?: boolean;
}

export interface StandingRow {
  position: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form: string[];
}

export interface MatchSummary {
  id: string;
  competitionSlug: string;
  round: string;
  venue: string;
  status: MatchStatus;
  kickOff: string;
  minute?: string;
  homeTeam: Team;
  awayTeam: Team;
  score: {
    home: number;
    away: number;
  };
}

export interface MatchEvent {
  id: string;
  minute: string;
  type: MatchEventType;
  teamId: string;
  player: string;
  description: string;
}

export interface MatchStat {
  label: string;
  home: string;
  away: string;
}

export interface MatchDetail extends MatchSummary {
  headline: string;
  summary: string;
  referee: string;
  attendance: string;
  timeline: MatchEvent[];
  stats: MatchStat[];
}

export interface CompetitionSnapshot {
  competition: Competition;
  dataSource: DataSource;
  updatedAt: string;
  standings: StandingRow[];
  matches: MatchSummary[];
}
