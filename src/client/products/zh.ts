import type { Product } from './types'

/** 中文产品列表。字段结构需与 en.ts 保持一致（均按 `Product` 校验），数组顺序即页面顺序。 */
export const zhProducts: Product[] = [
  {
    slug: 'chengyu-wisdom',
    name: '成语智慧',
    tagline: '四字成语，千年智慧。',
    description: '经典中文成语，作为通往中国传统哲学、思维方式与价值观的入口。',
    status: 'active',
    url: 'https://chengyu-wisdom.zkraft.cc/',
  },
  {
    slug: 'inpaint',
    name: 'Inpaint',
    tagline: '一键抹除，自然修复。',
    description: '上传图片，移除物体、人物或水印，AI 自动填充背景。',
    status: 'active',
    url: 'https://inpaint.zkraft.cc/',
  },
  {
    slug: 'zenshare',
    name: 'ZenShare',
    tagline: '轻松分享，自在传递。',
    description: '网页端分享工具，让内容传递更简单。',
    status: 'active',
    url: 'https://zenshare.zkraft.cc/',
  },
  {
    slug: 'ztools',
    name: '在线小工具集',
    tagline: '随手可用的小工具集。',
    description: '一系列简单实用的在线工具，打开即用。',
    status: 'active',
    url: 'https://ztools.zkraft.cc/',
  },
]
