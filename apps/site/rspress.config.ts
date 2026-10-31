import { resolve } from 'node:path'

import { defineConfig } from '@rspress/core'
import { pluginRss } from '@rspress/plugin-rss'
import { pluginSitemap } from '@rspress/plugin-sitemap'

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
  // SSG-MD: per-page .md, llms.txt, llms-full.txt (Agent-friendly docs).
  llms: true,
  plugins: [
    pluginSitemap(),
    pluginRss({
      feed: {
        id: 'blog',
        test: '/blog/posts/',
        title: `${intro.name} · ${intro.sections.writing}`,
        description: intro.description,
        language: 'zh-CN',
        copyright: `© ${new Date().getFullYear()} ${intro.name}`
      }
    })
  ],
  themeConfig: {
    darkMode: true,
    socialLinks: socialLinks(),
    // Copy Markdown / open-in-AI controls + injectLlmsHint for Agent discovery.
    llmsUI: {
      injectLlmsHint: true,
      viewOptions: ['markdownLink', 'chatgpt', 'claude'],
      placement: 'title'
    },
    footer: {
      message: `© ${new Date().getFullYear()} ${intro.name} · <a href="https://icp.gov.moe/?keyword=20260869" target="_blank" rel="noopener noreferrer">萌ICP备20260869号</a>`
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
