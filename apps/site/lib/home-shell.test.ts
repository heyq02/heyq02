import { describe, expect, it } from 'vite-plus/test'

import { renderHomeShellMdx } from './home-shell.ts'
import type { Intro } from './intro.ts'

const intro = {
  name: '贺同学',
  headline: '老师好',
  badge: '02',
  zodiac: '狮子座',
  home: { label: '通州区', latitude: 39.9, longitude: 116.6 },
  tags: ['开源'],
  bio: 'bio',
  about: 'about',
  kaomoji: '(´▽`)',
  moods: ['(´▽`)'],
  avatar: 'https://example.com/a.png',
  site: 'https://heyq02.com',
  title: '贺同学',
  contact: { email: 'hello@heyq02.com' },
  sections: { blog: '文章', openSource: '项目' },
  places: [{ label: 'GitHub', href: 'https://github.com/heyq02', detail: 'heyq02' }]
} satisfies Intro

describe('renderHomeShellMdx', () => {
  it('embeds ProfilePage and intro-derived frontmatter', () => {
    const mdx = renderHomeShellMdx(intro)
    expect(mdx).toContain('title: "贺同学"')
    expect(mdx).toContain('hideReadingTime: true')
    expect(mdx).toContain("import { ProfilePage } from '@theme/ProfilePage'")
    expect(mdx).toContain('<ProfilePage />')
  })
})
