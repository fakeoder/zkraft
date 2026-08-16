# zkraft.cc

The official landing page for [zkraft.cc](https://zkraft.cc) — where I introduce the site, the person behind it, and the products in the making.

## About the Site

zkraft.cc is where I publish the small products I build on my own. My goal is straightforward: to create things that solve real problems for some people, and to make a difference, however small.

## About Me

An ordinary coder — admittedly a little lazy and a little slow, but determined to build something different. Still working on it, one step at a time.

## Products

The section renders from client-side product data — every product lives in `src/client/products/` (`en.ts` / `zh.ts` for each language). No server round-trip; edit those files to add or change products.

## Tech Stack (V1)

Selected for simplicity, performance, and minimal operational overhead:

- [Vite](https://vitejs.dev/) — fast frontend build tooling
- [Hono](https://hono.dev/) — lightweight, high-performance web framework
- [Cloudflare Workers](https://workers.cloudflare.com/) — global edge runtime with zero server management
- [Cloudflare D1](https://developers.cloudflare.com/d1/) — serverless SQLite database

## Features

- **i18n** — `/en` and `/zh` URLs share one HTML shell; the locale is resolved from the path and the strings live in `en.ts` / `zh.ts`; `Accept-Language` + cookie negotiation on `/`, persisted in `localStorage` + cookie
- **Theming** — light/dark following `prefers-color-scheme`, manual toggle, no flash on load
- **PWA** — manifest, generated icons, Workbox service worker with an offline shell
- **Responsive & accessible** — mobile-first, semantic HTML, keyboard navigation, `prefers-reduced-motion`
- **API** — `POST /api/messages` (validated + rate-limited)

## Project Structure

```
src/
├── client/          # Vite frontend (shared main.html shell + app)
│   ├── app/         # page assembly, theme, SW registration, DOM helpers
│   ├── components/  # header, sections, footer
│   ├── i18n/        # EN/ZH dictionaries in `en.ts` and `zh.ts`
│   ├── products/    # EN/ZH product data in `en.ts` and `zh.ts`
│   └── styles/      # design tokens, base, layout
├── server/          # Hono worker (routes, API, middleware)
└── db/              # D1 schema + migrations
public/              # static assets (favicon, PWA icons)
wrangler.toml        # Workers / D1 bindings
```

## Getting Started

```bash
npm install
npm run types      # generate worker-configuration.d.ts from wrangler.toml (required for typecheck)
npm run dev        # Vite dev server with the worker on http://localhost:5173
npm run build      # production build (worker bundle + client assets)
npm run typecheck  # TypeScript project check
```

> `worker-configuration.d.ts` is generated (git-ignored) — run `npm run types` again after changing `wrangler.toml`.

## Deployment

```bash
# 1. Create the D1 database (one-time), then replace database_id in
#    wrangler.toml with the value printed by:
npx wrangler d1 create zkraft

# 2. Apply the schema migration
npm run db:migrate:remote

# 3. Deploy the worker + assets
npm run deploy
```

## Documentation

- [Design](design.md) — detailed design spec for the landing page (layout, theming, i18n, responsive, PWA)

## License

Released under the [MIT License](LICENSE).
