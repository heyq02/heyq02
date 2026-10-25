import { copyFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { liangmi } from '@liangmi/vp-config'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite-plus'

import intro from '../../static/data/intro.json' with { type: 'json' }

function copyCname(): Plugin {
  return {
    name: 'copy-cname',
    async closeBundle() {
      await copyFile(
        resolve(import.meta.dirname, 'CNAME'),
        resolve(import.meta.dirname, 'dist/CNAME')
      )
    }
  }
}

function htmlMeta(): Plugin {
  const pages = {
    '/index.html': intro.pages.home,
    '/blog/index.html': intro.pages.blog
  } as const

  return {
    name: 'html-meta',
    transformIndexHtml(html, ctx) {
      const page = ctx.path in pages ? pages[ctx.path as keyof typeof pages] : intro.pages.home
      return {
        html,
        tags: [
          {
            tag: 'title',
            children: page.title,
            injectTo: 'head'
          },
          {
            tag: 'meta',
            attrs: { name: 'description', content: page.description },
            injectTo: 'head'
          }
        ]
      }
    }
  }
}

export default liangmi({
  base: '/',
  plugins: [react(), tailwindcss(), htmlMeta(), copyCname()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        blog: resolve(import.meta.dirname, 'blog/index.html')
      }
    }
  }
})
