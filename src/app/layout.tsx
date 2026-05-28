import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arena Brasileirão",
  description: "Tabela, jogos, placares e lance a lance com visual inspirado em ge.globo.com.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
