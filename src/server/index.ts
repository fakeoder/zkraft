import { Hono } from 'hono'
import { api } from './api'
import { securityHeaders } from './middleware'
import { isLocale, negotiateLocale, themeFromCookie, type Bindings } from './types'

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', securityHeaders)

// --- Locale negotiation: / → the visitor's language -------------------------
app.get('/', (c) => {
  const locale = negotiateLocale(c.req.header('cookie'), c.req.header('accept-language'))
  return c.redirect(`/${locale}/`, 302)
})

// --- JSON API ----------------------------------------------------------------
app.route('/api', api)

// --- Locale shells: /en/ and /zh/ serve the built HTML ----------------------
app.get('/:locale{[a-z]{2}}', (c) => {
  const { locale } = c.req.param()
  return isLocale(locale) ? c.redirect(`/${locale}/`, 301) : c.notFound()
})

app.get('/:locale{[a-z]{2}}/', async (c) => {
  const { locale } = c.req.param()
  if (!isLocale(locale)) return c.notFound()
  // Dev: built assets don't exist yet. Forward the original request — the
  // `locale-shells` Vite middleware rewrites /en|/zh → the source HTML while
  // keeping the address-bar URL stable.
  if (import.meta.env.DEV) {
    return c.env.ASSETS.fetch(c.req.raw)
  }
  const url = new URL(c.req.url)
  // Both locales share one MPA shell (main.html); the locale is resolved
  // client-side from the path. Request the extension-less path and let Assets
  // map it (Assets redirects `xxx.html` → canonical `xxx` with 307, which
  // would make res.ok false).
  const asset = new Request(new URL(`/src/client/main`, url), c.req.raw)
  const res = await c.env.ASSETS.fetch(asset)
  if (!res.ok) return c.notFound()
  // Apply the saved theme before first paint (FOUC-free). Light is the CSS
  // default, so only the dark override needs to be injected.
  if (themeFromCookie(c.req.header('cookie')) !== 'dark') return res
  const html = (await res.text()).replace(
    /<html lang="(en|zh)"/,
    '<html lang="$1" data-theme="dark"',
  )
  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  })
})

// --- Everything else: static assets from the built bundle --------------------
app.all('*', async (c) => c.env.ASSETS.fetch(c.req.raw))

app.onError((err, c) => {
  console.error('unhandled error', err)
  return c.text('Internal Server Error', 500)
})

export default app
