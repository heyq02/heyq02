import { resolve } from 'node:path'

import { pluginBlogMeta } from '@heyq02/rspress-plugin-blog-meta'
import { pluginProfile } from '@heyq02/rspress-plugin-profile'
import { pluginSiteAssets } from '@heyq02/rspress-plugin-site-assets'
import { pluginWatermark } from '@heyq02/rspress-plugin-watermark'
import { pluginTailwindcss } from '@rsbuild/plugin-tailwindcss'
import { defineConfig } from '@rspress/core'
import { pluginRss } from '@rspress/plugin-rss'

import intro from '../../content/data/intro.json' with { type: 'json' }

const dir = import.meta.dirname
const blogsRoot = resolve(dir, 'blogs')
const themeDir = resolve(dir, 'theme')
const brandRoot = resolve(dir, '../../content/brand')
const sitePublic = resolve(dir, 'public')

export default defineConfig({
  root: blogsRoot,
  outDir: resolve(dir, 'dist'),
  themeDir,
  globalStyles: resolve(dir, 'tailwind.css'),
  builderConfig: {
    plugins: [pluginTailwindcss()]
  },

  // Chinese only: content lives at unprefixed routes, no language switcher.
  lang: 'zh',
  title: intro.title,
  description: intro.description,
  icon: '/favicon.png',
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
          const blurb = page.description ? `：${page.description}` : ''
          return `- [${page.title}](${page.link})${blurb}`
        })
        .join('\n')

      return `# ${title}

> ${description}

${intro.name} 的个人站点。标签：${intro.tags.join('、')}。

## 从这里开始

- [首页（个人简介）](${origin}/index.md)
- [友链](${origin}/friends.md)
- [博客](${origin}/blog/index.md)
- [完整 Markdown 合集](${origin}/llms-full.txt)

## 页面

${pages || '-（暂无其他页面）'}

## 联系方式

- 邮箱：${intro.contact.email}
- GitHub：https://github.com/heyq02
`
    }
  },
  webMcp: true,
  head: [
    ['meta', { name: 'author', content: intro.name }],
    ['meta', { property: 'og:site_name', content: intro.title }],
    ['meta', { property: 'og:image', content: intro.avatar }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:image', content: intro.avatar }],
    // Primer light theme only — no appearance toggle.
    `<script>(function(){var r=document.documentElement;r.setAttribute('data-color-mode','light');r.setAttribute('data-light-theme','light');r.setAttribute('data-dark-theme','dark')})()</script>`
  ],
  plugins: [
    pluginSiteAssets({
      outDir: resolve(blogsRoot, 'public'),
      signaturePath: resolve(brandRoot, 'signature.png'),
      wechatPath: resolve(sitePublic, 'wechat.jpg'),
      watermarkPath: resolve(sitePublic, 'wuxian-jinbu.png'),
      siteOrigin: intro.site,
      cnamePath: resolve(dir, 'CNAME')
    }),
    pluginBlogMeta({
      blogDir: resolve(blogsRoot, 'blog'),
      recentPostsPath: resolve(themeDir, 'recent-posts.ts'),
      formatRoot: dir
    }),
    pluginProfile({
      homeMdxPath: resolve(blogsRoot, 'index.mdx'),
      profileDataPath: resolve(themeDir, 'profile-data.ts'),
      intro,
      formatRoot: dir
    }),
    pluginWatermark({ src: '/wuxian-jinbu.png' }),
    pluginRss({
      feed: {
        id: 'blog',
        test: '/blog/posts/',
        title: `${intro.name} · 博客`,
        description: intro.description,
        language: 'zh-CN',
        copyright: `© ${new Date().getFullYear()} ${intro.name}`
      }
    })
  ],
  themeConfig: {
    darkMode: false,
    socialLinks: [],
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
  // Chinese-only site: override just the two built-in Overview strings that
  // Rspress defaults to API wording. `zh` is the only locale that renders.
  i18nSource: value => ({
    ...value,
    'overview.filterPlaceholderText': {
      ...value['overview.filterPlaceholderText'],
      zh: '搜索文章'
    },
    'overview.filterNoResultText': {
      ...value['overview.filterNoResultText'],
      zh: '没有匹配的文章'
    }
  })
})
