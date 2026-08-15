import { Hono, type Context } from 'hono'
import type { Bindings } from './types'
import { isLocale, type Locale } from './types'

export const api = new Hono<{ Bindings: Bindings }>()

type ApiContext = Context<{ Bindings: Bindings }>

/**
 * GET /api/config?locale=en|zh
 * Site content per locale. V1 serves from D1 `site_config` when present,
 * falling back to an empty config (the client ships its own locale bundles).
 */
api.get('/config', async (c: ApiContext) => {
  const locale = normalizeLocale(c.req.query('locale'))
  const db = c.env.DB

  if (!db) return c.json({ locale, source: 'default', config: {} })

  const { results } = await db
    .prepare('SELECT key, value FROM site_config WHERE locale = ?')
    .bind(locale)
    .all<{ key: string; value: string }>()

  const config = Object.fromEntries(results.map((row) => [row.key, row.value]))
  return c.json({ locale, source: results.length > 0 ? 'd1' : 'default', config })
})

/**
 * GET /api/products
 * Active products, ordered. Empty in V1 — the schema is ready.
 */
api.get('/products', async (c: ApiContext) => {
  const db = c.env.DB
  if (!db) return c.json({ products: [], source: 'default' })

  const { results } = await db
    .prepare(
      `SELECT id, slug, name, tagline, description, status, url, sort_order
       FROM products
       WHERE status = 'active'
       ORDER BY sort_order ASC, id ASC`,
    )
    .all()

  return c.json({ products: results, source: 'd1' })
})

/**
 * POST /api/messages
 * Visitor message: validated, rate-limited, stored in D1.
 */
api.post('/messages', async (c: ApiContext) => {
  const ip = c.req.header('cf-connecting-ip') ?? 'local'
  if (!(await checkRateLimit(ip))) {
    return c.json({ error: 'rate_limited' }, 429)
  }

  let raw: unknown
  try {
    raw = await c.req.json()
  } catch {
    return c.json({ error: 'invalid_json' }, 400)
  }

  const { name, email, message } = (raw ?? {}) as Record<string, unknown>
  const cleanName = cleanString(name, 100)
  const cleanEmail = cleanString(email, 254)
  const cleanMessage = cleanString(message, 2000)

  if (!cleanName) return c.json({ error: 'name_required' }, 400)
  if (cleanMessage.length < 5) return c.json({ error: 'message_too_short' }, 400)
  if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return c.json({ error: 'invalid_email' }, 400)
  }

  if (!c.env.DB) return c.json({ error: 'storage_unavailable' }, 503)

  await c.env.DB.prepare('INSERT INTO messages (name, email, body, ip) VALUES (?, ?, ?, ?)')
    .bind(cleanName, cleanEmail || null, cleanMessage, ip)
    .run()

  return c.json({ ok: true }, 201)
})

function normalizeLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : 'en'
}

function cleanString(value: unknown, max: number): string {
  if (typeof value !== 'string') return ''
  // Strip control characters, trim, and cap the length.
  return value
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
    .slice(0, max)
}

const RATE_LIMIT_PER_MINUTE = 10

/** Simple per-IP sliding-minute limit using the Cache API (no extra bindings). */
async function checkRateLimit(ip: string): Promise<boolean> {
  try {
    const cache = caches.default
    const minute = Math.floor(Date.now() / 60_000)
    const url = new URL(`https://rate.zkraft.internal/${ip}/${minute}`)
    const cached = await cache.match(url)
    const count = cached ? Number(cached.headers.get('x-count') ?? '0') : 0
    if (count >= RATE_LIMIT_PER_MINUTE) return false
    const next = new Response(null, {
      headers: { 'x-count': String(count + 1), 'Cache-Control': 'max-age=120' },
    })
    await cache.put(url, next)
    return true
  } catch {
    return true // fail-open: never block visitors on cache errors
  }
}
