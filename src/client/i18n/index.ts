import { en } from './en'
import { zh } from './zh'

export const locales = { en, zh } as const
export type Locale = keyof typeof locales
export type Dict = typeof en

const SUPPORTED = new Set<string>(Object.keys(locales))

/** localStorage key for the persisted locale choice (client-side). */
export const LOCALE_STORAGE_KEY = 'zkraft-locale'
/** Cookie name the worker reads for locale negotiation (server-side). */
export const LOCALE_COOKIE = 'zkraft_locale'

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && SUPPORTED.has(value)
}

/** Derive the locale from a URL path (`/en/...` or `/zh/...`); defaults to `en`. */
export function localeFromPath(path: string): Locale {
  const segments = path.split('/').filter(Boolean)
  // Standard locale-prefixed URLs: /en/…, /zh/…
  if (segments.length > 0 && isLocale(segments[0])) return segments[0]
  // Dev fallback: the worker redirects /zh/ → /src/client/zh, so a supported
  // locale can appear in a later segment.
  const found = segments.find(isLocale)
  return found ?? 'en'
}

/** Look up a dotted key in the dictionary, e.g. `t('en', 'about.siteBody')`. */
export function t(locale: Locale, key: string): string {
  let node: unknown = locales[locale]
  for (const part of key.split('.')) {
    if (node && typeof node === 'object' && part in node) {
      node = (node as Record<string, unknown>)[part]
    } else {
      return key
    }
  }
  return typeof node === 'string' ? node : key
}
