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
  logoText: intro.title,
  siteOrigin: 'https://heyq02.com',
  themeConfig: {
    darkMode: 'force-light',
    socialLinks: socialLinks()
  }
})
