/** Worker bindings declared in wrangler.toml. */
export type Bindings = {
  DB: D1Database
  ASSETS: Fetcher
}

export type Locale = 'en' | 'zh'

export const LOCALES: readonly Locale[] = ['en', 'zh']

export function isLocale(value: string | undefined): value is Locale {
  return value === 'en' || value === 'zh'
}

/**
 * Pick a locale for the root redirect. Priority: saved cookie → Accept-Language → `en`.
 */
export function negotiateLocale(cookieHeader: string | undefined, acceptLanguage: string | undefined): Locale {
  const cookieLocale = cookieHeader
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('zkraft_locale='))
    ?.split('=')[1]
  if (isLocale(cookieLocale)) return cookieLocale

  const preferred = acceptLanguage
    ?.split(',')
    .map((part) => part.split(';')[0].trim().toLowerCase())
    .find((tag) => tag.startsWith('zh'))
  if (preferred) return 'zh'

  return 'en'
}

/** Read the persisted theme from the `zkraft_theme` cookie, if present. */
export function themeFromCookie(cookieHeader: string | undefined): 'light' | 'dark' | undefined {
  const value = cookieHeader
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('zkraft_theme='))
    ?.split('=')[1]
  return value === 'light' || value === 'dark' ? value : undefined
}
