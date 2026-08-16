import type { Product } from './types'

/** 中文产品列表。字段结构需与 en.ts 保持一致（均按 `Product` 校验），数组顺序即页面顺序。 */
export const zhProducts: Product[] = [
  {
    slug: 'landing',
    name: '第一个产品 — 落地页',
    tagline: '第一个小东西，就是本站。',
    description: 'zkraft.cc 是小工具的聚集地。',
    status: 'active',
    url: 'https://zkraft.cc/',
  },
]
