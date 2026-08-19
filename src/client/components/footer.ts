import type { Locale } from '../i18n'
import { t } from '../i18n'
import { el } from '../app/dom'

/**
 * Social / contact links. Add more entries here as handles become available,
 * e.g. an X/Twitter link: { href: 'https://x.com/YOUR_HANDLE', key: 'footer.twitter' }.
 */
const SOCIAL_LINKS: Array<{ href: string; key: 'footer.github' | 'footer.contact' }> = [
  { href: 'https://github.com/fakeoder/zkraft', key: 'footer.github' },
  { href: 'mailto:contact@zkraft.cc', key: 'footer.contact' },
]

export function renderFooter(locale: Locale): HTMLElement {
  const footer = el('footer', { class: 'site-footer' })

  const left = el(
    'div',
    { class: 'footer-left' },
    el('p', { class: 'footer-copy' }, t(locale, 'footer.copyright')),
  )

  const right = el(
    'div',
    { class: 'footer-right' },
    ...SOCIAL_LINKS.map(({ href, key }) =>
      el(
        'a',
        { class: 'link-underline', href, rel: 'noopener noreferrer' },
        t(locale, key),
      ),
    ),
  )

  footer.append(el('div', { class: 'container footer-inner' }, left, right))
  return footer
}
