import type { Product } from './types'

/**
 * English product list. Keep the shape in sync with zh.ts (both are checked
 * against `Product`). Order in the array = order on the page.
 */
export const enProducts: Product[] = [
  {
    slug: 'landing',
    name: 'zkraft',
    tagline: 'Current site.',
    description: 'zkraft.cc is where small tools live.',
    status: 'active',
    url: 'https://zkraft.cc/',
  },
  {
    slug: 'chengyu-wisdom',
    name: 'Chengyu Wisdom',
    tagline: 'Wisdom in four characters.',
    description:
      'Classic Chinese idioms as a gateway to traditional Chinese philosophy, mindset and values.',
    status: 'active',
    url: 'https://chengyu-wisdom.zkraft.cc/',
  },
]
