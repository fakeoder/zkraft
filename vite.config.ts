import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { VitePWA } from 'vite-plugin-pwa'

/**
 * Dev-only: serve the locale URLs (/en, /zh) through the same HTML shell so the
 * browser keeps the locale-specific URL while the runtime resolves language from
 * the path. The worker's ASSETS binding forwards these requests to the Vite dev
 * server.
 */
function localeShells(): Plugin {
  return {
    name: 'locale-shells',
    apply: 'serve',
    configureServer(server) {
      const shell = resolve(import.meta.dirname, 'src/client/main.html')
      const shells: Record<string, string> = {
        '/en': shell,
        '/en/': shell,
        '/zh': shell,
        '/zh/': shell,
      }
      server.middlewares.use(async (req, res, next) => {
        const file = req.url ? shells[req.url] : undefined
        if (!file) return next()
        try {
          const raw = readFileSync(file, 'utf-8')
          const html = await server.transformIndexHtml(req.url!, raw)
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(html)
        } catch (err) {
          next(err as Error)
        }
      })
    },
  }
}

const pwaAssets = [
  'favicon.ico',
  'pwa-64x64.png',
  'pwa-192x192.png',
  'pwa-512x512.png',
  'maskable-icon-512x512.png',
]

// @cloudflare/vite-plugin builds a separate worker environment; the PWA plugins
// must only run for the client environment (they read the HTML entries).
const pwaPlugins = VitePWA({
  registerType: 'autoUpdate',
  includeAssets: pwaAssets,
  manifest: {
    name: 'zkraft.cc — small products, built in the open',
    short_name: 'zkraft',
    description:
      'zkraft.cc is where I publish the small products I build on my own — small tools that solve real problems.',
    lang: 'en',
    start_url: '/en/',
    scope: '/',
    display: 'standalone',
    theme_color: '#fbfcfe',
    background_color: '#fbfcfe',
    icons: [
      { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
      { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
      {
        src: 'maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
    navigateFallback: '/src/client/main.html',
  },
}).map((plugin) => ({
  ...plugin,
  applyToEnvironment: (environment: { name: string }) => environment.name === 'client',
}))

export default defineConfig({
  plugins: [cloudflare(), localeShells(), ...pwaPlugins],
  environments: {
    client: {
      build: {
        rollupOptions: {
          input: {
            main: resolve(import.meta.dirname, 'src/client/main.html'),
          },
        },
      },
    },
  },
})
