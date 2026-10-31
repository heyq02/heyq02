import { resolve } from 'node:path'

import { socialLinksFrom } from '@heyq02/shared'
import { pluginTailwindcss } from '@rsbuild/plugin-tailwindcss'
import { defineConfig } from '@rspress/core'
import { pluginRss } from '@rspress/plugin-rss'
import { pluginSitemap } from '@rspress/plugin-sitemap'
import { pluginBlogMeta } from 'rspress-plugin-blog-meta'
import { pluginGithubPins } from 'rspress-plugin-github-pins'
import { pluginProfile } from 'rspress-plugin-profile'
import { pluginSiteAssets } from 'rspress-plugin-site-assets'

import intro from '../../static/data/intro.json' with { type: 'json' }

const dir = import.meta.dirname
const siteRoot = dir
const themeDir = resolve(dir, '../../packages/rspress-theme-heyq02')

export default defineConfig({
  root: resolve(dir, 'blogs'),
  outDir: resolve(dir, 'dist'),
  themeDir,
  globalStyles: resolve(dir, 'tailwind.css'),
  builderConfig: {
    plugins: [pluginTailwindcss()]
  },

  lang: 'en',
  title: intro.title,
  description: intro.description,
  icon: '/favicon.ico',
  logo: '/signature.png',
  siteOrigin: intro.site,
  // SSG-MD: per-page .md, llms.txt, llms-full.txt (Agent-friendly docs).
  llms: true,
  plugins: [
    pluginSiteAssets({ siteRoot }),
    pluginGithubPins(),
    pluginBlogMeta({ siteRoot }),
    pluginProfile({ siteRoot, profilePlayModule: '@theme/ProfilePlay' }),
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
    socialLinks: socialLinksFrom(intro.places),
    // Agent discovery hint only; no Copy Markdown / open-in-AI chrome.
    llmsUI: {
      injectLlmsHint: true,
      viewOptions: false
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
