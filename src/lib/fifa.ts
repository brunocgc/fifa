import { getCompetition } from "@/lib/competitions";
import { getFallbackMatchDetail, getFallbackSnapshot } from "@/lib/mock-data";
import { CompetitionSnapshot, DataSource, MatchDetail, MatchEvent, MatchStat, MatchSummary, StandingRow, Team } from "@/lib/types";

interface FifaConfig {
  baseUrl: string;
  language: string;
  competitionId: string;
  seasonId: string;
  stageId: string;
}

function getConfig(): FifaConfig | null {
  const competitionId = process.env.FIFA_API_COMPETITION_ID;
  const seasonId = process.env.FIFA_API_SEASON_ID;
  const stageId = process.env.FIFA_API_STAGE_ID;

  if (!competitionId || !seasonId || !stageId) {
    return null;
  }

  return {
    baseUrl: process.env.FIFA_API_BASE_URL ?? "https://api.fifa.com/api/v3",
    language: process.env.FIFA_API_LANGUAGE ?? "pt-BR",
    competitionId,
    seasonId,
    stageId,
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function readFirst(values: unknown[], path: string[]) {
  for (const value of values) {
    let current: unknown = value;
    for (const segment of path) {
      const record = asRecord(current);
      current = record?.[segment];
    }

    if (current !== undefined && current !== null) {
      return current;
    }
  }

  return undefined;
}

function readDescription(value: unknown): string | undefined {
  const record = asRecord(value);
  const localizedItems = asArray(record?.["TeamName"] ?? record?.["Name"] ?? value);

  for (const item of localizedItems) {
    const description = readString(asRecord(item)?.["Description"] ?? item);
    if (description) {
      return description;
    }
  }

  return readString(record?.["Description"] ?? value);
}

function parseTeam(raw: unknown, fallbackId: string): Team {
  const record = asRecord(raw) ?? {};
  return {
    id: readString(record["IdTeam"] ?? record["IdCountry"] ?? record["IdAssociation"]) ?? fallbackId,
    name: readDescription(raw) ?? fallbackId,
    shortName: readString(record["ShortClubName"]) ?? readDescription(raw)?.slice(0, 3).toUpperCase() ?? fallbackId,
    code: readString(record["Abbreviation"]) ?? readString(record["ShortClubName"]) ?? fallbackId.slice(0, 3).toUpperCase(),
  };
}

function parseMatchSummary(raw: unknown): MatchSummary | null {
  const record = asRecord(raw);
  if (!record) {
    return null;
  }

  const homeTeam = parseTeam(record["HomeTeam"] ?? record["Home"], "HOME");
  const awayTeam = parseTeam(record["AwayTeam"] ?? record["Away"], "AWAY");
  const homeScore = readNumber(record["HomeTeamScore"] ?? record["HomeScore"] ?? readFirst([record["Score"]], ["Home"])) ?? 0;
  const awayScore = readNumber(record["AwayTeamScore"] ?? record["AwayScore"] ?? readFirst([record["Score"]], ["Away"])) ?? 0;
  const statusCode = readString(record["MatchStatus"] ?? record["Status"] ?? record["Period"]);
  const status: MatchSummary["status"] =
    statusCode?.includes("live") || statusCode?.includes("progress") || statusCode === "3"
      ? "LIVE"
      : statusCode?.includes("finished") || statusCode?.includes("closed") || statusCode === "4"
        ? "FINISHED"
        : "UPCOMING";

  const id = readString(record["IdMatch"] ?? record["Id"]);
  const kickOff = readString(record["Date"] ?? record["DateTime"] ?? record["LocalDate"]);

  if (!id || !kickOff) {
    return null;
  }

  return {
    id,
    competitionSlug: "brasileirao",
    round: readString(record["StageName"]) ?? "Brasileirão",
    venue: readDescription(record["Stadium"] ?? record["Venue"]) ?? "A definir",
    status,
    kickOff,
    minute: readString(record["MatchTime"] ?? record["Minute"]),
    homeTeam,
    awayTeam,
    score: {
      home: homeScore,
      away: awayScore,
    },
  };
}

function parseStandingRow(raw: unknown, index: number): StandingRow | null {
  const record = asRecord(raw);
  if (!record) {
    return null;
  }

  const team = parseTeam(record["Team"] ?? record["Participant"], `TEAM-${index}`);
  const played = readNumber(record["Played"] ?? record["MatchesPlayed"]);
  const won = readNumber(record["Won"] ?? record["Wins"]);
  const drawn = readNumber(record["Draw"] ?? record["Drawn"]);
  const lost = readNumber(record["Lost"] ?? record["Losses"]);
  const goalsFor = readNumber(record["GoalsFor"] ?? record["GF"]);
  const goalsAgainst = readNumber(record["GoalsAgainst"] ?? record["GA"]);
  const points = readNumber(record["Points"] ?? record["Pts"]);

  if (
    played === undefined ||
    won === undefined ||
    drawn === undefined ||
    lost === undefined ||
    goalsFor === undefined ||
    goalsAgainst === undefined ||
    points === undefined
  ) {
    return null;
  }

  return {
    position: readNumber(record["Position"] ?? record["Rank"]) ?? index + 1,
    team,
    played,
    won,
    drawn,
    lost,
    goalsFor,
    goalsAgainst,
    points,
    form: asArray(record["Form"])
      .map((item) => readString(asRecord(item)?.["Result"] ?? item))
      .filter((item): item is string => Boolean(item)),
  };
}

function parseTimeline(raw: unknown): MatchEvent[] {
  return asArray(raw)
    .map((item, index) => {
      const record = asRecord(item);
      if (!record) {
        return null;
      }

      return {
        id: readString(record["IdEvent"] ?? record["Id"]) ?? `event-${index}`,
        minute: readString(record["MatchMinute"] ?? record["Minute"] ?? record["Time"]) ?? "--",
        type:
          (readString(record["Type"] ?? record["EventType"])?.toLowerCase().includes("goal")
            ? "goal"
            : readString(record["Type"] ?? record["EventType"])?.toLowerCase().includes("card")
              ? "card"
              : readString(record["Type"] ?? record["EventType"])?.toLowerCase().includes("sub")
                ? "substitution"
                : readString(record["Type"] ?? record["EventType"])?.toLowerCase().includes("pen")
                  ? "penalty"
                  : "var") as MatchEvent["type"],
        teamId: readString(record["IdTeam"] ?? record["IdCountry"]) ?? "team",
        player: readString(record["PlayerName"] ?? record["Subject"] ?? record["Title"]) ?? "—",
        description: readString(record["Description"] ?? record["Text"] ?? record["Content"]) ?? "",
      };
    })
    .filter((item): item is MatchEvent => Boolean(item));
}

function buildStats(summary: MatchSummary): MatchStat[] {
  return [
    { label: "Goals", home: String(summary.score.home), away: String(summary.score.away) },
    { label: "Status", home: summary.status, away: summary.minute ?? summary.status },
  ];
}

async function fetchJson(url: string) {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`FIFA API request failed with status ${response.status}`);
  }

  return response.json() as Promise<unknown>;
}

export async function getCompetitionSnapshot(): Promise<CompetitionSnapshot> {
  const config = getConfig();
  const fallback = getFallbackSnapshot();

  if (!config) {
    return fallback;
  }

  try {
    const [standingsResponse, matchesResponse] = await Promise.all([
      fetchJson(
        `${config.baseUrl}/calendar/${config.competitionId}/${config.seasonId}/${config.stageId}/Standing?language=${config.language}`,
      ),
      fetchJson(
        `${config.baseUrl}/calendar/matches?idCompetition=${config.competitionId}&idSeason=${config.seasonId}&idStage=${config.stageId}&language=${config.language}&count=50`,
      ),
    ]);

    const standingsItems =
      asArray(asRecord(standingsResponse)?.["Results"]) ||
      asArray(asRecord(standingsResponse)?.["Groups"]);
    const matchesItems =
      asArray(asRecord(matchesResponse)?.["Results"]) ||
      asArray(asRecord(matchesResponse)?.["Matches"]);

    const standings = standingsItems
      .flatMap((item) => {
        const table = asArray(asRecord(item)?.["Standing"] ?? item);
        return table.length ? table : [item];
      })
      .map(parseStandingRow)
      .filter((item): item is StandingRow => Boolean(item));

    const matches = matchesItems.map(parseMatchSummary).filter((item): item is MatchSummary => Boolean(item));

    if (!standings.length || !matches.length) {
      return fallback;
    }

    return {
      competition: getCompetition("brasileirao"),
      dataSource: "fifa",
      updatedAt: new Date().toISOString(),
      standings,
      matches,
    };
  } catch {
    return fallback;
  }
}

export async function getMatchDetail(matchId: string): Promise<{ detail: MatchDetail | null; dataSource: DataSource }> {
  const config = getConfig();
  const fallbackDetail = getFallbackMatchDetail(matchId);

  if (!config) {
    return { detail: fallbackDetail, dataSource: "fallback" };
  }

  try {
    const [matchResponse, timelineResponse] = await Promise.all([
      fetchJson(
        `${config.baseUrl}/live/football/${config.competitionId}/${config.seasonId}/${config.stageId}/${matchId}?language=${config.language}`,
      ),
      fetchJson(
        `${config.baseUrl}/timelines/${config.competitionId}/${config.seasonId}/${config.stageId}/${matchId}?language=${config.language}`,
      ),
    ]);

    const summary = parseMatchSummary(asRecord(matchResponse)?.["Match"] ?? matchResponse);
    if (!summary) {
      return { detail: fallbackDetail, dataSource: "fallback" };
    }

    const timeline = parseTimeline(
      asRecord(timelineResponse)?.["Results"] ?? asRecord(timelineResponse)?.["Timeline"] ?? timelineResponse,
    );

    return {
      detail: {
        ...summary,
        headline: `${summary.homeTeam.name} x ${summary.awayTeam.name}`,
        summary: "Live data delivered by FIFA API.",
        referee: "FIFA feed",
        attendance: "—",
        timeline,
        stats: buildStats(summary),
      },
      dataSource: "fifa",
    };
  } catch {
    return { detail: fallbackDetail, dataSource: fallbackDetail ? "fallback" : "fifa" };
  }
}
