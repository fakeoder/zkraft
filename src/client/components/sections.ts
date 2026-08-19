import type { Locale } from '../i18n'
import { t } from '../i18n'
import type { Product } from '../products'
import { productList } from '../products'
import { el, svg } from '../app/dom'

/** Right arrow for the "Explore Products" CTA (nudges right on hover). */
const ARROW_RIGHT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>`

/** Map a product status to a localized i18n key. */
const STATUS_LABEL_KEYS: Record<string, string> = {
  draft: 'products.status.draft',
  active: 'products.status.active',
  archived: 'products.status.archived',
}

function renderHero(locale: Locale): HTMLElement {
  return el(
    'section',
    { class: 'hero' },
    el(
      'div',
      { class: 'container' },
      el(
        'div',
        { class: 'hero-status' },
        el('span', { class: 'status-dot', 'aria-hidden': 'true' }),
        el('span', {}, t(locale, 'hero.status')),
      ),
      el('h1', { class: 'hero-title' }, t(locale, 'hero.title')),
      el('p', { class: 'hero-intro' }, t(locale, 'hero.intro')),
      el(
        'div',
        { class: 'hero-actions' },
        el(
          'a',
          { class: 'btn', href: '#products' },
          t(locale, 'hero.exploreProducts'),
          svg(ARROW_RIGHT_SVG),
        ),
      ),
    ),
  )
}

/** Product shape as shipped in the client bundle (src/client/products). */
function renderProducts(locale: Locale): HTMLElement {
  const grid = el('div', { class: 'product-grid' })
  const list = productList[locale]
  grid.append(
    ...(list.length > 0
      ? list.map((p) => renderProductCard(locale, p))
      : [renderEmptyState(locale)]),
  )
  return el(
    'section',
    { class: 'section', id: 'products' },
    el('div', { class: 'container' }, el('h2', { class: 'section-title' }, t(locale, 'products.heading')), grid),
  )
}

/** The graceful "coming soon" card — kept as the offline/failure fallback. */
function renderEmptyState(locale: Locale): HTMLElement {
  return el(
    'div',
    { class: 'empty-state', role: 'note' },
    el('p', { class: 'empty-title' }, t(locale, 'products.emptyTitle')),
    el('p', { class: 'empty-body' }, t(locale, 'products.emptyBody')),
    el(
      'a',
      {
        class: 'empty-link link-underline',
        href: 'https://github.com/fakeoder/zkraft',
        rel: 'noopener noreferrer',
      },
      t(locale, 'products.emptyLink'),
    ),
  )
}

/** One product card; the whole card is a link when a url exists. */
function renderProductCard(locale: Locale, product: Product): HTMLElement {
  const statusKey = STATUS_LABEL_KEYS[product.status] ?? STATUS_LABEL_KEYS.draft
  // Favicon of the product's own site as the card logo. SVG is vector —
  // stays crisp at any size (fall back to .ico if a site ships no svg).
  const favicon = product.url ? `${new URL(product.url).origin}/favicon.svg` : ''
  const children: Array<Node | null> = [
    el(
      'div',
      { class: 'product-card-head' },
      favicon
        ? el('img', {
            class: 'product-logo',
            src: favicon,
            alt: '',
            width: '32',
            height: '32',
          })
        : null,
      el('h3', { class: 'product-name' }, product.name),
    ),
    product.tagline ? el('p', { class: 'product-tagline' }, product.tagline) : null,
    product.description ? el('p', { class: 'product-desc' }, product.description) : null,
    el('span', { class: 'product-status' }, t(locale, statusKey)),
  ]
  return product.url
    ? el(
        'a',
        {
          class: 'product-card',
          href: product.url,
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        ...children,
      )
    : el('div', { class: 'product-card' }, ...children)
}

/** "About" — avatar initials, two short paragraphs, and a "Currently" line. */
function renderAbout(locale: Locale): HTMLElement {
  return el(
    'section',
    { class: 'section', id: 'about' },
    el(
      'div',
      { class: 'container' },
      el('h2', { class: 'section-title' }, t(locale, 'about.heading')),
      el(
        'div',
        { class: 'about' },
        el('div', { class: 'about-avatar', 'aria-hidden': 'true' }, 'Z'),
        el(
          'div',
          { class: 'about-body' },
          el('p', { class: 'about-text' }, t(locale, 'about.siteBody')),
        ),
      ),
    ),
  )
}

export function renderSections(locale: Locale): HTMLElement {
  const main = el('main', { id: 'main' })
  main.append(renderHero(locale), renderProducts(locale), renderAbout(locale))
  return main
}
