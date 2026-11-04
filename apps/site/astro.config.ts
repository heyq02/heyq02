import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { remarkAlert } from 'remark-github-blockquote-alert'

import intro from '../../static/data/intro.json' with { type: 'json' }

export default defineConfig({
  site: intro.site,
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkAlert]
  },
  vite: {
    plugins: [tailwindcss()]
  }
})
