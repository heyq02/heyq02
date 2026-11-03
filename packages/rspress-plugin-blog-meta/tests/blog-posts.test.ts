import { resolve } from 'node:path'

import { expect, it } from 'vite-plus/test'

import {
  BLOG_LABELS,
  dateFromSlug,
  listBlogPosts,
  listInterviewNotes,
  renderBlogMetaJson,
  renderPostsMetaJson
} from '../src/blog-posts.ts'

const sitePostsDir = resolve(import.meta.dirname, '../../../apps/site/blogs/blog/posts')
const siteInterviewDir = resolve(import.meta.dirname, '../../../apps/site/blogs/blog/interview')

it('lists markdown posts under apps/site/blogs/blog/posts', async () => {
  const posts = await listBlogPosts(sitePostsDir)
  expect(posts.length).toBeGreaterThan(0)
  expect(posts.map(post => post.slug)).toEqual([
    'macos-disable-ime-switching',
    'webpack-import-path-variables',
    'building-personal-site-with-rspress',
    'multi-mcp-aggregation-nginx-vs-express',
    'idea-change-maven-repository',
    'weixin-homepage-ui-recreation',
    'install-guide-idea',
    'fun-project-vitepress-blog',
    'npm-download-daily-report',
    'fun-project-image-transformer',
    'fun-project-get-license-changelog',
    'fun-project-get-license',
    'fun-project-2048',
    'anaconda-vscode-encoding-bug',
    'install-guide-anaconda',
    'threejs-notes-1-geometries',
    'vue-router-hash-external-listen',
    'iframe-child-route-state',
    'react-path-alias-background-image',
    'vue3-cannot-find-app-vue',
    'konva-notes-0-project-setup',
    'component-library-default-style-override',
    'git-operations-practice',
    'vue3-bubble-sort-visualization',
    'typescript-multidimensional-arrays',
    'csdn-weekly-contest-33-javascript-solutions',
    'svg-source-editing-guide',
    'mockjs-source-util-extend',
    'latex-mcm-template-demo2',
    'install-guide-python-370',
    'python-crc-encoding',
    'python-binary-tree',
    'python-tkinter-radix-converter',
    'wechat-miniprogram-radix-converter',
    'python-big-digits-exercises',
    'latex-mcm-tables-figures-equations',
    'csdn-skill-tree-review',
    'javascript-red-book-chapter-3-syntax',
    'javascript-red-book-chapter-4-variables-scope-memory',
    'javascript-dom-nodes-overview',
    'python-310-standard-library-links',
    'vue-fastapi-mysql-demo',
    'vue-custom-directives',
    'qixi-chat-robot',
    'javascript-objects-in-depth',
    'honor-of-kings-skin-hero-prediction',
    'latex-mcm-template-texpage-guide',
    'install-guide-mathematica-12',
    'install-guide-vmware-workstation-15'
  ])
  expect(posts[0]?.href).toBe('/blog/posts/macos-disable-ime-switching/')
  expect(posts[0]?.date).toBe('2026-10-31')
  expect(posts[0]?.title).toContain('macOS')
  expect(posts.find(post => post.slug === 'building-personal-site-with-rspress')?.date).toBe(
    '2026-06-22'
  )
  expect(posts.find(post => post.slug === 'svg-source-editing-guide')?.date).toBe('2023-03-03')
  expect(posts.at(-1)?.slug).toBe('install-guide-vmware-workstation-15')
})

it('lists interview notes newest-first separately from posts', async () => {
  const notes = await listInterviewNotes(siteInterviewDir)
  expect(notes.length).toBe(28)
  expect(notes[0]?.slug).toBe('daily-frontend-interview-2024-03-18-pause')
  expect(notes[0]?.href).toBe('/blog/interview/daily-frontend-interview-2024-03-18-pause/')
  expect(notes[0]?.date).toBe('2024-03-18')
  expect(notes.at(-1)?.slug).toBe('daily-frontend-interview-2023-02-22')
  expect(dateFromSlug('daily-frontend-interview-2024-03-01')).toBe('2024-03-01')
  expect(dateFromSlug('jd-frontend-interview-1')).toBe('')
})

it('renders Chinese blog sidebar meta with 概览, 文章, and 面经', () => {
  expect(JSON.parse(renderBlogMetaJson())).toEqual([
    { type: 'file', name: 'index', label: '概览' },
    { type: 'dir', name: 'posts', label: '文章' },
    { type: 'dir', name: 'interview', label: '面经' }
  ])
  expect(BLOG_LABELS.posts).toBe('文章')
})

it('renders posts sidebar meta from post slugs', () => {
  expect(
    JSON.parse(
      renderPostsMetaJson([
        {
          slug: 'demo',
          href: '/blog/posts/demo/',
          title: '示例',
          description: '一段笔记',
          date: '2026-10-31'
        }
      ])
    )
  ).toEqual([{ type: 'file', name: 'demo', label: '示例', overviewHeaders: [2] }])
})
