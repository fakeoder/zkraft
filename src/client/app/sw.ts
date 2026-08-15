import { registerSW } from 'virtual:pwa-register'

/** Register the Workbox service worker (production build only). */
export function setupPWA(): void {
  registerSW({ immediate: true })
}
