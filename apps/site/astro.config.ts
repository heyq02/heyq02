import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import remarkDirective from 'remark-directive'

import intro from '../../static/data/intro.json' with { type: 'json' }
import { remarkAdmonitions } from './src/lib/remark-admonitions.ts'

export default defineConfig({
  site: intro.site,
  trailingSlash: 'always',
  integrations: [react(), sitemap()],
  markdown: {
    remarkPlugins: [remarkDirective, remarkAdmonitions]
  },
  vite: {
    plugins: [tailwindcss()]
  }
})
