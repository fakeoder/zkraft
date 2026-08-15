export const en = {
  header: {
    langLabel: 'Switch language',
    themeLabel: 'Toggle theme',
  },
  hero: {
    status: 'In progress',
    title: 'Small products, built in the open.',
    intro:
      'I build small tools that solve real problems. This is where they live, and where I share what I learn.',
    exploreProducts: 'Explore Products',
  },
  products: {
    heading: 'Products',
    emptyTitle: 'Coming soon',
    emptyBody: 'I’m still exploring and learning, and new things are on the way.',
    emptyLink: 'Follow progress on GitHub',
    status: {
      draft: 'In progress',
      active: 'Live',
      archived: 'Archived',
    },
  },
  about: {
    heading: 'About',
    siteBody:
      'zkraft.cc is where I publish the small products I build on my own. The goal is straightforward: to create things that solve real problems for some people, and to make a difference, however small.',
    meBody:
      'An ordinary coder — admittedly a little lazy and a little slow, but determined to build **something different**. Still working on it, one step at a time.',
    currently: 'Currently building small tools with Cloudflare Workers + D1.',
  },
  footer: {
    github: 'GitHub',
    copyright: '© 2025 zkraft.cc',
  },
}

/** Dictionary shape — every locale must provide exactly these keys. */
export type Dict = typeof en
