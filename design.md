# Design — zkraft.cc Landing Page

Detailed design specification for the zkraft.cc landing page.

## 1. Overview

The landing page introduces the site, the person behind it, and the products. It is a single-page, content-focused site designed to be simple, pleasant, and easy to read, with support for multiple languages, light/dark themes, all screen sizes, and offline access via PWA.

## 2. Tech Stack

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend build | **Vite** | Dev server, bundling, code splitting, asset optimization |
| Framework / API | **Hono** | Lightweight routing, middleware, API endpoints on the edge |
| Runtime | **Cloudflare Workers** | Global edge runtime; serves the frontend and API with zero server management |
| Database | **Cloudflare D1** | Serverless SQLite — site config, visitor messages (product info ships with the client) |
| Storage | — | No blob storage in V1; images are limited to small static assets served with the frontend |

### 2.1 Architecture

```
Browser
   │
   ▼
Cloudflare Workers (Hono)
   │  ├── serves built frontend assets (bundled)
   │  ├── /api/* routes (JSON)
   │  └── i18n negotiation, security headers
   │
   └── Cloudflare D1 (structured data: config, messages; products are client-side)
```

- **Frontend**: built by Vite, deployed as static assets served through the Worker (Hono static middleware).
- **Backend**: Hono app on Workers exposing a minimal JSON API (`POST /api/messages`).
- **Data**: D1 stores structured content, accessed via Worker bindings.

### 2.2 Directory Layout

```
/
├── src/
│   ├── client/          # Vite frontend entry
│   │   ├── app/
│   │   ├── components/
│   │   ├── styles/
│   │   └── i18n/
│   ├── server/          # Hono worker entry (routes, middleware)
│   └── db/              # D1 schema + migrations
├── public/              # static assets (manifest, icons)
├── wrangler.toml        # CF Workers / D1 bindings
├── package.json
└── design.md
```

## 3. Design Principles

Every decision should honor these traits, in priority order:

1. **Simple** — No clutter. One idea per section, minimal visual noise, generous whitespace.
2. **Clear structure** — Obvious hierarchy: hero → products → about → footer. Each section has one clear heading and purpose.
3. **Reading-friendly** — Comfortable line length (≈60–75ch), legible type scale, readable contrast, logical reading order, scannable short paragraphs.
4. **Playful** — Small, tasteful touches: a subtle accent color, a witty one-liner, micro-interactions that never block reading.
5. **Relaxed** — Soft colors, gentle spacing, no urgency; the page feels calm, not salesy.
6. **Open** — Transparent about being a work in progress; invites feedback (e.g., a GitHub link to the project).
7. **Professional** — Consistent typography, alignment, spacing system; correct English; no broken links or placeholders.
8. **Polite** — Gentle copy ("please", "thank you" where fitting), no dark patterns, no nagging modals.
9. **Respectful** — Respects user preferences: reduced motion, system color scheme, language choice, small page weight, no autoplaying media.

## 4. Page Structure

| Section | Content |
|---|---|
| Header | Site name `zkraft.cc`, language switcher, theme toggle |
| Hero | Status badge, one-line positioning + short intro, "Explore Products" CTA (scrolls to products) |
| Products | Cards rendered from client-side product data (`src/client/products/en.ts` / `zh.ts`); a graceful "coming soon" empty state when there are none |
| About | Site intro + personal intro in one card, plus a "Currently" status line |
| Footer | GitHub link, copyright |

### 4.1 Content (EN default)

- **Hero**: "Small products, built in the open." / "I build small tools that solve real problems. This is where they live, and where I share what I learn."
- **Products**: "Coming soon — I'm still exploring and learning, and new things are on the way." plus a "Follow progress on GitHub" link
- **About (site)**: "zkraft.cc is where I publish the small products I build on my own. The goal is straightforward: to create things that solve real problems for some people, and to make a difference, however small."
- **About (me)**: "An ordinary coder — admittedly a little lazy and a little slow, but determined to build something different. Still working on it, one step at a time." (plus "Currently building small tools with Cloudflare Workers + D1.")

## 5. Multi-language Support

- **Default language**: English (all copy authored in EN).
- **Strategy**: URL-prefix routing (`/en`, `/zh`) with `Accept-Language` negotiation and a manual switcher in the header. The root `/` redirects to the visitor's language.
- **Persistence**: the choice is saved in `localStorage` and mirrored to a cookie the worker reads on the next visit.
- **Implementation**: lightweight i18n dictionary keyed by locale (no heavy framework needed); `<html lang>` and `hreflang` tags set correctly.
- **Scope (V1)**: EN + ZH. Architecture must make adding locales a data-only change.

## 6. Light / Dark Mode

- **Default**: follow system via `prefers-color-scheme`.
- **Manual override**: toggle in header; persisted in `localStorage` + cookie.
- **Implementation**: CSS custom properties (design tokens) for colors; `[data-theme="light"|"dark"]` on `<html>`; the worker injects the saved theme into the HTML so there is no flash on load. Color transitions run only when motion is allowed (`prefers-reduced-motion` respected).
- **Contrast**: both themes meet WCAG AA for body text.

## 7. Responsive Layout

- **Approach**: mobile-first, fluid, single focused column (max 720px).

| Breakpoint | Range | Layout notes |
|---|---|---|
| Mobile | < 640px | Single column, stacked sections, compact header controls |
| Pad / PC | ≥ 640px | Product cards in 2 columns; footer splits into two rows |

- Tap targets ≥ 44px on touch devices; touch-friendly menu (no hover-dependent navigation).

## 8. PWA Support

- **Manifest**: name, short name, theme color, icons (64/192/512 + maskable).
- **Service worker**: Workbox via `vite-plugin-pwa` — precaches the app shell (both locale shells + assets); runtime cache for assets.
- **Offline**: page shell remains readable offline (EN shell is the offline fallback); content-only updates fetched when online.
- **Installability**: meets basic install criteria (HTTPS, manifest, SW). Not a primary goal — treat as a progressive enhancement.

## 9. Performance & Accessibility

- **Performance targets**: LCP < 2.5s, CLS < 0.1, INP < 200ms (mobile 4G).
- Minimal hand-written CSS (no framework); Inter + Noto Sans SC via Google Fonts with a system fallback; no page images (the About avatar is an inline initials mark).
- **Accessibility**: semantic HTML (`header/main/section/footer`), one `h1`, visible focus states, `alt` text, `aria` labels for icon-only controls, full keyboard navigation, `prefers-reduced-motion` respected.

## 10. API & Data (V1)

- `POST /api/messages` — optional visitor message: validated (name required, message ≥ 5 chars, optional email format) and rate-limited (10/min per IP via the Cache API).
- Products: no longer an API endpoint — product info ships with the client bundle in `src/client/products/en.ts` / `zh.ts` and renders directly (an empty list shows the "coming soon" empty state).
- D1 schema (current): `messages` only — site content ships with the client, and product data lives in `src/client/products`.

## 11. Development & Deployment

| Step | Command |
|---|---|
| Install | `npm install` |
| Generate worker types | `npm run types` |
| Local dev (worker + client) | `npm run dev` |
| Typecheck | `npm run typecheck` |
| Migrate D1 (local / remote) | `npm run db:migrate:local` / `npm run db:migrate:remote` |
| Build | `npm run build` |
| Deploy | `npm run deploy` (build + `wrangler deploy`) |

- `wrangler.toml` declares the Workers script, D1 database binding, and Assets directory (`./dist`).

## 12. Milestones

- **M1 — Foundation** ✅: Vite + Hono scaffold, build & deploy pipeline, design tokens, responsive shell, EN content.
- **M2 — Theming & i18n** ✅: light/dark, ZH locale, language switcher.
- **M3 — PWA** ✅: manifest, service worker, offline shell.
- **M4 — Data** ✅: D1 schema + API (`messages`). Products were later moved client-side (`src/client/products`) and the D1 `products` table dropped.
- **M5 — Polish** 🚧: performance, accessibility audit, content review.
