# Arena Brasileirão

Site em Next.js para acompanhar o Brasileirão com visual inspirado em **ge.globo.com**, com:
- tabela,
- jogos,
- placares,
- lance a lance,
- internacionalização (`pt`, `en`, `es`),
- base pronta para futuros campeonatos, incluindo a **Copa do Mundo de 2026**.

## Stack

- Next.js 16 + App Router
- TypeScript
- ESLint
- GitHub Actions para CI/CD

## Como iniciar

### 1. Instale as dependências

```bash
npm install
```

### 2. Rode em desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

### 3. Gere o build de produção

```bash
npm run build
npm start
```

## Integração com a FIFA API

O projeto já possui uma camada preparada para consumir endpoints da FIFA no servidor. Para habilitar a integração, configure as variáveis abaixo em um arquivo `.env.local`:

```bash
FIFA_API_BASE_URL=https://api.fifa.com/api/v3
FIFA_API_LANGUAGE=pt-BR
FIFA_API_COMPETITION_ID=
FIFA_API_SEASON_ID=
FIFA_API_STAGE_ID=
```

> Enquanto essas variáveis não estiverem configuradas — ou se a API não responder — o site usa dados locais de fallback para desenvolvimento e demonstração.

## Internacionalização

As rotas ficam disponíveis em:
- `/pt`
- `/en`
- `/es`

## Estrutura do projeto

- `src/app/[locale]`: páginas internacionalizadas
- `src/app/[locale]/match/[matchId]`: central da partida com placar, resumo e linha do tempo
- `src/lib/fifa.ts`: camada de integração com a FIFA API + fallback
- `src/lib/competitions.ts`: catálogo de campeonatos para expansão futura
- `src/lib/messages.ts`: traduções

## CI/CD

Foram adicionados dois workflows em `.github/workflows`:

### `ci.yml`
Executa em push e pull request:
- `npm ci`
- `npm run lint`
- `npm run build`

### `cd.yml`
Executa deploy automático na branch `main` usando Vercel.

Configure os secrets abaixo no GitHub para ativar o deploy:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Próximos passos

- conectar IDs reais da competição/temporada/fase da FIFA API;
- adicionar seletor completo de campeonatos;
- incorporar mais estatísticas por partida quando disponíveis na API.
