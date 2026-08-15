import type { Locale } from '../i18n'
import { t } from '../i18n'
import { el, svg } from '../app/dom'

/** Language self-names — intentionally not translated (native names only). */
const LANG_NAMES: Record<Locale, string> = { en: 'English', zh: '中文' }
/** Short language labels for the switcher button. */
const LANG_SHORT: Record<Locale, string> = { en: 'EN', zh: '中文' }

const SUN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`

const MOON_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`

const CARET_ICON = `<svg xmlns="http://www.w3.org/2000/svg" class="lang-caret" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>`

export function renderHeader(locale: Locale): HTMLElement {
  const header = el('header', { class: 'site-header' })
  const inner = el('div', { class: 'container header-inner' })

  const brand = el(
    'a',
    { class: 'site-brand', href: `/${locale}/`, 'aria-label': 'zkraft.cc — home' },
    el('span', { class: 'brand-name' }, 'zkraft'),
    el('span', { class: 'brand-tld' }, '.cc'),
  )

  const controls = el('div', { class: 'header-controls' })

  // Language switcher — click-triggered dropdown.
  const switcher = el('div', { class: 'lang-switcher' })
  const langBtn = el(
    'button',
    {
      class: 'lang-btn',
      type: 'button',
      'aria-haspopup': 'true',
      'aria-expanded': 'false',
      'aria-controls': 'lang-menu',
      'aria-label': t(locale, 'header.langLabel'),
      title: t(locale, 'header.langLabel'),
    },
    el('span', { class: 'lang-current' }, LANG_SHORT[locale]),
    svg(CARET_ICON),
  )
  const menu = el('ul', { class: 'lang-menu', id: 'lang-menu', role: 'menu' })
  for (const loc of Object.keys(LANG_NAMES) as Locale[]) {
    const option = el(
      'button',
      {
        class: 'lang-option',
        type: 'button',
        role: 'menuitem',
        'data-locale': loc,
        'aria-selected': loc === locale ? 'true' : 'false',
      },
      LANG_NAMES[loc],
    )
    menu.append(el('li', { role: 'none' }, option))
  }
  menu.hidden = true
  switcher.append(langBtn, menu)

  const themeBtn = el('button', {
    class: 'icon-btn',
    id: 'theme-toggle',
    type: 'button',
    'aria-label': t(locale, 'header.themeLabel'),
    title: t(locale, 'header.themeLabel'),
  })
  const sun = el('span', { class: 'icon-sun' })
  const moon = el('span', { class: 'icon-moon' })
  sun.append(svg(SUN_ICON))
  moon.append(svg(MOON_ICON))
  themeBtn.append(sun, moon)

  controls.append(switcher, themeBtn)
  inner.append(brand, controls)
  header.append(inner)
  return header
}
