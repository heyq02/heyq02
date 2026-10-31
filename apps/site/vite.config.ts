import { createReadStream } from 'node:fs'
import { copyFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { liangmi } from '@liangmi/vp-config'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin, PluginOption } from 'vite-plus'

// Never import `@heyq02/*` here: `vp run` loads every app's vite.config before packages are built.
import intro from '../../static/data/intro.json' with { type: 'json' }

const monorepoRoot = resolve(import.meta.dirname, '../..')
const signature = {
  '/favicon.ico': resolve(monorepoRoot, 'static/signature/full-nobg.ico'),
  '/favicon.png': resolve(monorepoRoot, 'static/signature/full-nobg.png')
} as const

function copyCname(): Plugin {
  return {
    name: 'copy-cname',
    async closeBundle() {
      const from = resolve(import.meta.dirname, 'CNAME')
      try {
        await copyFile(from, resolve(import.meta.dirname, 'dist/CNAME'))
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw error
        }
      }
    }
  }
}

/** Dev-serve and emit favicons from `static/signature` (no copies under public/). */
function signatureFavicons(): Plugin {
  return {
    name: 'signature-favicons',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split('?', 1)[0]
        const from =
          path && path in signature ? signature[path as keyof typeof signature] : undefined
        if (!from) {
          next()
          return
        }
        res.setHeader('Content-Type', path === '/favicon.ico' ? 'image/x-icon' : 'image/png')
        createReadStream(from).pipe(res)
      })
    },
    async closeBundle() {
      const dist = resolve(import.meta.dirname, 'dist')
      await Promise.all(
        Object.entries(signature).map(([url, from]) => copyFile(from, resolve(dist, url.slice(1))))
      )
    }
  }
}

/** Inject title/description from intro. */
function htmlMeta(): Plugin {
  return {
    name: 'html-meta',
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'title',
            children: intro.title,
            injectTo: 'head'
          },
          {
            tag: 'meta',
            attrs: { name: 'description', content: intro.description },
            injectTo: 'head'
          }
        ]
      }
    }
  }
}

export default liangmi({
  base: '/',
  plugins: [react(), tailwindcss(), htmlMeta(), copyCname(), signatureFavicons()] as PluginOption[],
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/index.tsx', 'src/env.d.ts'],
      thresholds: {
        statements: 95,
        branches: 95,
        functions: 95,
        lines: 95
      }
    }
  },
  run: {
    tasks: {
      // App code imports `@heyq02/profile` / `@heyq02/brands` from package exports.
      cbuild: {
        command: 'vp build',
        dependsOn: [{ task: 'build', from: 'dependencies' }]
      },
      dev: {
        command: 'vp dev',
        cache: false,
        dependsOn: [{ task: 'build', from: 'dependencies' }]
      }
    }
  }
})
