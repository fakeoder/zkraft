const THEME_KEY = 'zkraft-theme'
const THEME_COOKIE = 'zkraft_theme'

/** Current theme — always set by the inline head script before first paint. */
export function currentTheme(): 'light' | 'dark' {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

/** Toggle light/dark, persist it, and mirror it to the server via cookie. */
export function setupThemeToggle(): void {
  const btn = document.getElementById('theme-toggle')
  btn?.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      /* ignore */
    }
    const secure = location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax${secure}`
  })
}
