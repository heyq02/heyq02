import { resolve } from 'node:path'

import { defineConfig } from '@rspress/core'

import intro from '../../static/data/intro.json' with { type: 'json' }
import { socialLinks } from './src/social-links.ts'

const dir = import.meta.dirname

export default defineConfig({
  root: resolve(dir, 'blogs'),
  outDir: resolve(dir, 'dist'),
  themeDir: resolve(dir, 'theme'),
  lang: 'en',
  title: intro.title,
  description: intro.description,
  icon: '/favicon.ico',
  logo: '/signature.png',
  siteOrigin: intro.site,
  themeConfig: {
    darkMode: true,
    socialLinks: socialLinks(),
    footer: {
      message: `© ${new Date().getFullYear()} ${intro.name}`
    }
  },
  i18nSource: {
    'overview.filterPlaceholderText': {
      en: 'Search posts'
    },
    'overview.filterNoResultText': {
      en: 'No matching posts found'
    }
  } as Record<string, Record<string, string>>
})
