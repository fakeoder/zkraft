import './styles/main.css'
import { localeFromPath, t } from './i18n'
import { render } from './app'
import { setupThemeToggle } from './app/theme'
import { setupPWA } from './app/sw'

const locale = localeFromPath(location.pathname)
document.documentElement.lang = locale

const metaDescription = document.querySelector('meta[name="description"]')
if (metaDescription) metaDescription.setAttribute('content', t(locale, 'hero.intro'))

document.title = t(locale, 'hero.title')

const canonical = document.querySelector('link[rel="canonical"]')
if (canonical) canonical.setAttribute('href', `https://zkraft.cc/${locale}/`)

const enLink = document.querySelector('link[hreflang="en"]')
if (enLink) enLink.setAttribute('href', 'https://zkraft.cc/en/')

const zhLink = document.querySelector('link[hreflang="zh"]')
if (zhLink) zhLink.setAttribute('href', 'https://zkraft.cc/zh/')

const defaultLink = document.querySelector('link[hreflang="x-default"]')
if (defaultLink) defaultLink.setAttribute('href', 'https://zkraft.cc/')

render(locale)
setupThemeToggle()
setupPWA()
