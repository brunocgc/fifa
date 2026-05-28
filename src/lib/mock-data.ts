import { CompetitionSnapshot, MatchDetail, MatchSummary, StandingRow, Team } from "@/lib/types";
import { getCompetition } from "@/lib/competitions";

const teams: Record<string, Team> = {
  fla: { id: "fla", name: "Flamengo", shortName: "FLA", code: "FLA" },
  pal: { id: "pal", name: "Palmeiras", shortName: "PAL", code: "PAL" },
  bot: { id: "bot", name: "Botafogo", shortName: "BOT", code: "BOT" },
  flu: { id: "flu", name: "Fluminense", shortName: "FLU", code: "FLU" },
  gre: { id: "gre", name: "Grêmio", shortName: "GRE", code: "GRE" },
  cap: { id: "cap", name: "Athletico-PR", shortName: "CAP", code: "CAP" },
  cam: { id: "cam", name: "Atlético-MG", shortName: "CAM", code: "CAM" },
  int: { id: "int", name: "Internacional", shortName: "INT", code: "INT" },
};

const standings: StandingRow[] = [
  {
    position: 1,
    team: teams.fla,
    played: 8,
    won: 6,
    drawn: 1,
    lost: 1,
    goalsFor: 16,
    goalsAgainst: 6,
    points: 19,
    form: ["W", "W", "D", "W", "W"],
  },
  {
    position: 2,
    team: teams.pal,
    played: 8,
    won: 5,
    drawn: 2,
    lost: 1,
    goalsFor: 14,
    goalsAgainst: 7,
    points: 17,
    form: ["W", "D", "W", "W", "L"],
  },
  {
    position: 3,
    team: teams.bot,
    played: 8,
    won: 5,
    drawn: 1,
    lost: 2,
    goalsFor: 12,
    goalsAgainst: 7,
    points: 16,
    form: ["L", "W", "W", "W", "D"],
  },
  {
    position: 4,
    team: teams.flu,
    played: 8,
    won: 4,
    drawn: 2,
    lost: 2,
    goalsFor: 11,
    goalsAgainst: 8,
    points: 14,
    form: ["W", "W", "L", "D", "W"],
  },
  {
    position: 5,
    team: teams.gre,
    played: 8,
    won: 4,
    drawn: 1,
    lost: 3,
    goalsFor: 9,
    goalsAgainst: 8,
    points: 13,
    form: ["D", "L", "W", "W", "W"],
  },
  {
    position: 6,
    team: teams.cap,
    played: 8,
    won: 3,
    drawn: 3,
    lost: 2,
    goalsFor: 10,
    goalsAgainst: 9,
    points: 12,
    form: ["D", "W", "D", "L", "W"],
  },
];

const matches: MatchSummary[] = [
  {
    id: "match-fla-pal",
    competitionSlug: "brasileirao",
    round: "9ª rodada",
    venue: "Maracanã",
    status: "LIVE",
    kickOff: "2026-05-28T19:30:00-03:00",
    minute: "71'",
    homeTeam: teams.fla,
    awayTeam: teams.pal,
    score: { home: 2, away: 1 },
  },
  {
    id: "match-bot-flu",
    competitionSlug: "brasileirao",
    round: "9ª rodada",
    venue: "Nilton Santos",
    status: "FINISHED",
    kickOff: "2026-05-27T20:00:00-03:00",
    homeTeam: teams.bot,
    awayTeam: teams.flu,
    score: { home: 1, away: 1 },
  },
  {
    id: "match-gre-cam",
    competitionSlug: "brasileirao",
    round: "9ª rodada",
    venue: "Arena do Grêmio",
    status: "UPCOMING",
    kickOff: "2026-05-29T21:00:00-03:00",
    homeTeam: teams.gre,
    awayTeam: teams.cam,
    score: { home: 0, away: 0 },
  },
  {
    id: "match-cap-int",
    competitionSlug: "brasileirao",
    round: "9ª rodada",
    venue: "Ligga Arena",
    status: "UPCOMING",
    kickOff: "2026-05-30T18:30:00-03:00",
    homeTeam: teams.cap,
    awayTeam: teams.int,
    score: { home: 0, away: 0 },
  },
];

const matchDetails: Record<string, MatchDetail> = {
  "match-fla-pal": {
    ...matches[0],
    headline: "Flamengo pressiona no segundo tempo e segura a liderança diante do Palmeiras.",
    summary:
      "Pedro abriu o placar cedo, Estêvão empatou em transição rápida e Arrascaeta recolocou o Flamengo em vantagem. O time rubro-negro mantém a intensidade e administra a posse na reta final.",
    referee: "Anderson Daronco",
    attendance: "58.420",
    timeline: [
      {
        id: "evt-1",
        minute: "08'",
        type: "goal",
        teamId: "fla",
        player: "Pedro",
        description: "Recebeu cruzamento de Ayrton Lucas e finalizou de primeira.",
      },
      {
        id: "evt-2",
        minute: "24'",
        type: "goal",
        teamId: "pal",
        player: "Estêvão",
        description: "Empatou em contra-ataque após passe de Raphael Veiga.",
      },
      {
        id: "evt-3",
        minute: "41'",
        type: "card",
        teamId: "pal",
        player: "Murilo",
        description: "Cartão amarelo por falta em Bruno Henrique.",
      },
      {
        id: "evt-4",
        minute: "54'",
        type: "goal",
        teamId: "fla",
        player: "Arrascaeta",
        description: "Cobrou falta no canto esquerdo e marcou o segundo.",
      },
      {
        id: "evt-5",
        minute: "63'",
        type: "substitution",
        teamId: "pal",
        player: "Rony",
        description: "Entrou no lugar de Flaco López para aumentar a pressão.",
      },
      {
        id: "evt-6",
        minute: "69'",
        type: "var",
        teamId: "fla",
        player: "Sala do VAR",
        description: "Revisão confirma impedimento em gol anulado do Palmeiras.",
      },
    ],
    stats: [
      { label: "Posse de bola", home: "57%", away: "43%" },
      { label: "Finalizações", home: "14", away: "10" },
      { label: "Finalizações no alvo", home: "6", away: "4" },
      { label: "Escanteios", home: "7", away: "5" },
    ],
  },
  "match-bot-flu": {
    ...matches[1],
    headline: "Botafogo e Fluminense dividem pontos em clássico equilibrado.",
    summary:
      "Com um tempo dominante para cada lado, o empate mantém as duas equipes na parte de cima da tabela.",
    referee: "Bráulio da Silva Machado",
    attendance: "33.108",
    timeline: [
      {
        id: "evt-7",
        minute: "17'",
        type: "goal",
        teamId: "bot",
        player: "Júnior Santos",
        description: "Aproveitou rebote dentro da área e abriu o placar.",
      },
      {
        id: "evt-8",
        minute: "61'",
        type: "goal",
        teamId: "flu",
        player: "Germán Cano",
        description: "Cabeceou firme após cruzamento de Arias.",
      },
    ],
    stats: [
      { label: "Posse de bola", home: "48%", away: "52%" },
      { label: "Finalizações", home: "9", away: "11" },
      { label: "Chances claras", home: "2", away: "3" },
      { label: "Defesas", home: "4", away: "3" },
    ],
  },
};

export function getFallbackSnapshot(): CompetitionSnapshot {
  return {
    competition: getCompetition("brasileirao"),
    dataSource: "fallback",
    updatedAt: "2026-05-28T21:15:00-03:00",
    standings,
    matches,
  };
}

export function getFallbackMatchDetail(matchId: string) {
  return matchDetails[matchId] ?? null;
}
