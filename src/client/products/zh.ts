import type { Product } from './types'

/** 中文产品列表。字段结构需与 en.ts 保持一致（均按 `Product` 校验），数组顺序即页面顺序。 */
export const zhProducts: Product[] = [
  {
    slug: 'landing',
    name: 'zkraft',
    tagline: '就是本站。',
    description: 'zkraft.cc 是小工具的聚集地。',
    status: 'active',
    url: 'https://zkraft.cc/',
  },
  {
    slug: 'chengyu-wisdom',
    name: '成语智慧',
    tagline: '四字成语，千年智慧。',
    description: '经典中文成语，作为通往中国传统哲学、思维方式与价值观的入口。',
    status: 'active',
    url: 'https://chengyu-wisdom.zkraft.cc/',
  },
]
