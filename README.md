# zkraft.cc

> The official landing page for [zkraft.cc](https://zkraft.cc) — introducing the site, the person behind it, and the products in the making.

A single-page, content-first site built for speed, accessibility, and minimal operational overhead. English and Chinese, light and dark themes, and offline support via PWA — all served from the edge.

## Highlights

- **i18n** — `/en` and `/zh` share one HTML shell; the locale is resolved from the path, with `Accept-Language` + cookie negotiation on `/` and the choice persisted in `localStorage` + cookie.
- **Theming** — light/dark following `prefers-color-scheme`, a manual toggle, and no flash on load.
- **PWA** — manifest, generated icons, and a Workbox service worker with an offline shell.
- **Responsive & accessible** — mobile-first, semantic HTML, keyboard navigation, and `prefers-reduced-motion` support.
- **API** — a minimal `POST /api/messages` endpoint (validated + rate-limited).

## Tech Stack

Chosen for simplicity, performance, and minimal operational overhead:

| Layer | Technology |
|---|---|
| Frontend build | [Vite](https://vitejs.dev/) |
| Framework / API | [Hono](https://hono.dev/) |
| Runtime | [Cloudflare Workers](https://workers.cloudflare.com/) |
| Database | [Cloudflare D1](https://developers.cloudflare.com/d1/) |

## Project Structure

```
src/
├── client/          # Vite frontend (shared main.html shell + app)
│   ├── app/         # page assembly, theme, SW registration, DOM helpers
│   ├── components/  # header, sections, footer
│   ├── i18n/        # EN/ZH dictionaries in `en.ts` and `zh.ts`
│   ├── products/    # EN/ZH product data in `en.ts` and `zh.ts`
│   └── styles/      # design tokens, base, layout, effects
├── server/          # Hono worker (routes, API, middleware)
└── db/              # D1 schema + migrations
public/              # static assets (favicon, PWA icons)
wrangler.toml        # Workers / D1 bindings
```

## Getting Started

**Requirements:** Node.js 20+ and npm.

```bash
npm install
npm run types      # generate worker-configuration.d.ts from wrangler.toml (required for typecheck)
npm run dev        # Vite dev server with the worker on http://localhost:5173
```

> `worker-configuration.d.ts` is generated and git-ignored — re-run `npm run types` after changing `wrangler.toml`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (worker + client) |
| `npm run build` | Production build (worker bundle + client assets) |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Run the TypeScript project check |
| `npm run types` | Generate `worker-configuration.d.ts` from `wrangler.toml` |
| `npm run icons` | Regenerate PWA icons |
| `npm run deploy` | Build and deploy with `wrangler deploy` |
| `npm run db:migrate:local` | Apply D1 migrations locally |
| `npm run db:migrate:remote` | Apply D1 migrations to the remote database |

## Deployment

```bash
# 1. (One-time) Create the D1 database and update database_id in wrangler.toml
npx wrangler d1 create zkraft

# 2. Apply the schema migration
npm run db:migrate:remote

# 3. Deploy the worker + assets
npm run deploy
```

## Adding a Product

Products are rendered client-side — no server round-trip. Edit the locale files in
`src/client/products/` (`en.ts` / `zh.ts`) to add or change products.

## Documentation

- [Design](design.md) — detailed design spec (layout, theming, i18n, responsive, PWA)

## License

Released under the [MIT License](LICENSE).
