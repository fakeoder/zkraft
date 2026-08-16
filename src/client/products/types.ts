/**
 * Product data now ships with the client bundle (src/client/products/*.ts)
 * instead of being read from D1. Edit en.ts / zh.ts to change what renders.
 */

/** Mirrors the i18n label keys `products.status.*`. */
export type ProductStatus = 'draft' | 'active' | 'archived'

export type Product = {
  slug: string
  name: string
  tagline: string
  description: string
  status: ProductStatus
  /** Optional external link; empty string renders the card without a link. */
  url: string
}
