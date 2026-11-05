import { resolve } from 'node:path'

import { pluginAnnotationWords } from '@heyq02/rspress-plugin-annotation-words'
import { pluginBlogMeta } from '@heyq02/rspress-plugin-blog-meta'
import { pluginGhPagesWorkflow } from '@heyq02/rspress-plugin-gh-pages-workflow'
import { pluginSiteAssets } from '@heyq02/rspress-plugin-site-assets'
import { pluginSiteDist } from '@heyq02/rspress-plugin-site-dist'
import { pluginWatermark } from '@heyq02/rspress-plugin-watermark'
import { siteDescription } from '@heyq02/rspress-site-content'
import { pluginGitDiff } from '@kazamori/rspress-plugin-git-diff'
import { pluginTailwindcss } from '@rsbuild/plugin-tailwindcss'
import { defineConfig } from '@rspress/core'
import { pluginRss } from '@rspress/plugin-rss'
import readingTime from 'rspress-plugin-reading-time'

import { siteBlogMetaOptions } from './lib/blog-meta.ts'
import { pluginHomeShell } from './lib/home-shell.ts'
import { intro } from './lib/intro.ts'

const description = siteDescription(intro)

const dir = import.meta.dirname
const blogsRoot = resolve(dir, 'blogs')
const themeDir = resolve(dir, 'theme')
const brandRoot = resolve(dir, '../../content/brand')
const dataRoot = resolve(dir, '../../content/data')
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
  description,
  icon: '/favicon.png',
  logo: '/signature.png',
  siteOrigin: intro.site,
  // Built-in in Rspress ≥2.1 (replaces @rspress/plugin-sitemap).
  sitemap: true,
  // SSG-MD + browser WebMCP tools (Rspress ≥2.1).
  llms: {
    llmsTxt: ({ title, description: siteDesc, siteOrigin, sections }) => {
      const origin = siteOrigin ?? intro.site
      const pages = sections
        .flatMap(section => section.pages)
        .map(page => {
          const blurb = page.description ? `：${page.description}` : ''
          return `- [${page.title}](${page.link})${blurb}`
        })
        .join('\n')

      return `# ${title}

> ${siteDesc}

${intro.name} 的个人站点。

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
    ['meta', { name: 'twitter:image', content: intro.avatar }]
  ],
  plugins: [
    pluginSiteAssets({
      outDir: resolve(blogsRoot, 'public'),
      faviconPath: resolve(brandRoot, 'favicon.png'),
      signaturePath: resolve(brandRoot, 'signature.png'),
      wechatPath: resolve(sitePublic, 'wechat.jpg'),
      watermarkPath: resolve(sitePublic, 'wuxian-jinbu.png'),
      wordsMapPath: resolve(dataRoot, 'words-map.json')
    }),
    pluginSiteDist({
      siteOrigin: intro.site,
      cnamePath: resolve(dir, 'CNAME')
    }),
    pluginHomeShell({
      homeMdxPath: resolve(blogsRoot, 'index.mdx'),
      intro
    }),
    pluginBlogMeta(siteBlogMetaOptions()),
    pluginWatermark({ src: '/wuxian-jinbu.png' }),
    pluginGitDiff({
      // Keep ?diff= tags aligned with semver releases (avoids dumping every git tag).
      tagPattern: /^v\d/
    }),
    readingTime({ defaultLocale: 'zh-CN' }),
    pluginAnnotationWords({
      wordsMapPath: 'words-map.json',
      ignorePaths: [
        /^\/(?:index\.html)?$/,
        /^\/friends(?:\/|$|\.html)/,
        /^\/changes(?:\/|$|\.html)/
      ]
    }),
    pluginGhPagesWorkflow({ outDir: resolve(dir, 'dist') }),
    pluginRss({
      feed: {
        id: 'blog',
        test: '/blog/posts/',
        title: `${intro.name} · 博客`,
        description,
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
