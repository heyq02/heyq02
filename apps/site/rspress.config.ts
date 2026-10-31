import { resolve } from 'node:path'

import { defineConfig } from '@rspress/core'

import intro from '../../static/data/intro.json' with { type: 'json' }
import chinese from '../../static/data/intro.zh.json' with { type: 'json' }

const dir = import.meta.dirname

export default defineConfig({
  root: resolve(dir, 'blogs'),
  outDir: resolve(dir, 'dist'),
  lang: 'zh',
  title: intro.title,
  description: chinese.description,
  icon: '/favicon.ico',
  logoText: intro.title,
  siteOrigin: 'https://heyq02.com',
  locales: [
    {
      lang: 'zh',
      label: '简体中文',
      title: intro.title,
      description: chinese.description
    },
    {
      lang: 'en',
      label: 'English',
      title: intro.title,
      description: intro.description
    }
  ]
})
