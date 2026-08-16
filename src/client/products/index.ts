import { enProducts } from './en'
import { zhProducts } from './zh'
import type { Locale } from '../i18n'
import type { Product, ProductStatus } from './types'

/**
 * Products per locale — rendered directly by the client, no server round-trip.
 * `productList[locale]` is empty → the "coming soon" empty state shows.
 */
export const productList: Record<Locale, readonly Product[]> = {
  en: enProducts,
  zh: zhProducts,
}

export type { Product, ProductStatus }
