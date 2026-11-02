import { resolve } from 'node:path'

import { socialLinksFrom } from '@heyq02/shared'
import { pluginTailwindcss } from '@rsbuild/plugin-tailwindcss'
import { defineConfig } from '@rspress/core'
import { pluginRss } from '@rspress/plugin-rss'
import { pluginBlogMeta } from 'rspress-plugin-blog-meta'
import { pluginBlogTranslate } from 'rspress-plugin-blog-translate'
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

  // Respect explicit `/zh/` URLs; do not auto-redirect by browser language.
  route: {
    localeRedirect: 'never'
  },
  // English is the default language, so its routes stay unprefixed; Chinese lives under `/zh/`.
  lang: 'en',
  locales: [
    {
      lang: 'en',
      label: 'English',
      title: intro.title,
      description: intro.description
    },
    {
      lang: 'zh',
      label: '简体中文',
      title: intro.title,
      description: intro.description
    }
  ],
  title: intro.title,
  description: intro.description,
  icon: '/favicon.ico',
  logo: '/signature.png',
  siteOrigin: intro.site,
  // Built-in in Rspress ≥2.1 (replaces @rspress/plugin-sitemap).
  sitemap: true,
  // SSG-MD + browser WebMCP tools (Rspress ≥2.1).
  llms: {
    llmsTxt: ({ title, description, siteOrigin, sections }) => {
      const origin = siteOrigin ?? intro.site
      const pages = sections
        .flatMap(section => section.pages)
        .map(page => {
          const blurb = page.description ? `: ${page.description}` : ''
          return `- [${page.title}](${page.link})${blurb}`
        })
        .join('\n')

      return `# ${title}

> ${description}

Personal site for ${intro.name}. Tags: ${intro.tags.join(', ')}.

## Start here

- [Home (profile)](${origin}/index.md)
- [Friends](${origin}/friends.md)
- [Blog](${origin}/blog/index.md)
- [Full Markdown bundle](${origin}/llms-full.txt)

## Pages

${pages || '- (no additional pages yet)'}

## Contact

- Email: ${intro.contact.email}
- GitHub: https://github.com/heyq02
`
    }
  },
  webMcp: true,
  head: [
    ['meta', { name: 'author', content: intro.name }],
    ['meta', { property: 'og:site_name', content: intro.title }],
    ['meta', { property: 'og:image', content: intro.avatar }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:image', content: intro.avatar }]
  ],
  plugins: [
    pluginSiteAssets({ siteRoot }),
    // Must run before blog meta so `_meta.json` reflects translated titles.
    pluginBlogTranslate({ siteRoot }),
    pluginBlogMeta({ siteRoot }),
    pluginProfile({ siteRoot }),
    pluginRss({
      feed: [
        {
          id: 'blog',
          test: '/blog/posts/',
          title: `${intro.name} · Blog`,
          description: intro.description,
          language: 'en',
          copyright: `© ${new Date().getFullYear()} ${intro.name}`
        },
        {
          id: 'blog-zh',
          test: '/zh/blog/posts/',
          title: `${intro.name} · 博客`,
          description: intro.description,
          language: 'zh-CN',
          copyright: `© ${new Date().getFullYear()} ${intro.name}`,
          output: { filename: 'blog.zh.xml' }
        }
      ]
    })
  ],
  themeConfig: {
    darkMode: true,
    socialLinks: socialLinksFrom(intro.places),
    // Avoid Rspress injecting frontmatter title as a duplicate H1 on profile/friends.
    fallbackHeadingTitle: false,
    lastUpdated: true,
    editLink: {
      docRepoBaseUrl: 'https://github.com/heyq02/heyq02/tree/main/apps/site/blogs'
    },
    // Agent discovery hint only. viewOptions: false hides the open-in-AI menu;
    // Copy Markdown itself has no config flag, so chrome.css hides .rp-llms-container.
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
      en: 'Search posts',
      zh: '搜索文章'
    },
    'overview.filterNoResultText': {
      en: 'No matching posts found',
      zh: '没有匹配的文章'
    }
  }
})
