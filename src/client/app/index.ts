import type { Locale } from '../i18n'
import { LOCALE_COOKIE, LOCALE_STORAGE_KEY } from '../i18n'
import { renderHeader } from '../components/header'
import { renderSections } from '../components/sections'
import { renderFooter } from '../components/footer'

/** Build the whole page shell for a locale and wire up the language switcher. */
export function render(locale: Locale): void {
  const app = document.getElementById('app')
  if (!app) return
  app.replaceChildren(renderHeader(locale), renderSections(locale), renderFooter(locale))
  setupLocaleSwitcher(locale)
}

/** Click-triggered language dropdown (no hover; Escape / outside-click close it). */
function setupLocaleSwitcher(locale: Locale): void {
  const btn = document.querySelector<HTMLButtonElement>('.lang-btn')
  const menu = document.querySelector<HTMLUListElement>('.lang-menu')
  if (!btn || !menu) return

  const close = (): void => {
    btn.setAttribute('aria-expanded', 'false')
    menu.hidden = true
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation()
    if (menu.hidden) {
      btn.setAttribute('aria-expanded', 'true')
      menu.hidden = false
    } else {
      close()
    }
  })

  menu.addEventListener('click', (e) => {
    const option = (e.target as HTMLElement).closest<HTMLButtonElement>('.lang-option')
    if (!option) return
    const next = option.dataset.locale
    if (!next || next === locale) {
      close()
      return
    }
    switchLocale(next as Locale)
  })

  document.addEventListener('click', (e) => {
    if (menu.hidden) return
    if (!(e.target as HTMLElement).closest('.lang-switcher')) close()
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) {
      close()
      btn.focus()
    }
  })
}

/** Persist the choice (localStorage + cookie) and navigate to the locale URL. */
function switchLocale(next: Locale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, next)
  } catch {
    /* storage unavailable — cookie still works */
  }
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax${secure}`
  location.assign(`/${next}/`)
}
