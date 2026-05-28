import { Competition } from "@/lib/types";

export const competitions: Competition[] = [
  {
    slug: "brasileirao",
    name: "Brasileirão Série A",
    season: "2026",
    region: "Brasil",
    accent: "#1fa14a",
    enabled: true,
  },
  {
    slug: "copa-do-brasil",
    name: "Copa do Brasil",
    season: "2026",
    region: "Brasil",
    accent: "#0f6ccf",
    enabled: false,
    comingSoon: true,
  },
  {
    slug: "world-cup-2026",
    name: "Copa do Mundo 2026",
    season: "2026",
    region: "FIFA",
    accent: "#0d2f87",
    enabled: false,
    comingSoon: true,
  },
];

export function getCompetition(slug: string) {
  return competitions.find((competition) => competition.slug === slug) ?? competitions[0];
}
