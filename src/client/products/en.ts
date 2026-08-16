import type { Product } from './types'

/**
 * English product list. Keep the shape in sync with zh.ts (both are checked
 * against `Product`). Order in the array = order on the page.
 */
export const enProducts: Product[] = [
  {
    slug: 'landing',
    name: 'First product — Landing Page',
    tagline: 'The first small thing, current site.',
    description: 'zkraft.cc is where small tools live.',
    status: 'active',
    url: 'https://zkraft.cc/',
  },
]
