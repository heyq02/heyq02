import { describe, expect, it } from 'vitest'

import {
  assertFriendsData,
  assertGithubProfileData,
  assertIntro,
  assertRecentPosts
} from './validate.ts'

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
}

describe('assertIntro', () => {
  it('accepts a complete intro', () => {
    expect(assertIntro(intro).name).toBe('贺同学')
  })

  it('rejects missing contact email', () => {
    expect(() => assertIntro({ ...intro, contact: {} })).toThrow(/intro\.contact\.email/)
  })
})

describe('assertFriendsData', () => {
  it('accepts friends with optional desc', () => {
    expect(
      assertFriendsData({
        title: '友链',
        friends: [{ name: 'A', url: 'https://a.dev', avatar: 'https://a.dev/a.png' }]
      }).friends
    ).toHaveLength(1)
  })

  it('rejects empty friend name', () => {
    expect(() =>
      assertFriendsData({
        title: '友链',
        friends: [{ name: '', url: 'https://a.dev', avatar: 'https://a.dev/a.png' }]
      })
    ).toThrow(/friends\.friends\[0\]\.name/)
  })
})

describe('assertGithubProfileData', () => {
  it('accepts projects + contribution weeks', () => {
    expect(
      assertGithubProfileData({
        projects: [
          {
            name: 'demo',
            href: 'https://github.com/heyq02/demo',
            summary: 's',
            language: 'TypeScript',
            stars: 1,
            forks: 0
          }
        ],
        contributions: {
          total: 1,
          href: 'https://github.com/heyq02',
          weeks: [[{ date: '2026-01-01', count: 1, level: 1 }]]
        }
      }).contributions.total
    ).toBe(1)
  })

  it('rejects invalid contribution levels', () => {
    expect(() =>
      assertGithubProfileData({
        projects: [],
        contributions: {
          total: 0,
          href: 'https://github.com/heyq02',
          weeks: [[{ date: '2026-01-01', count: 0, level: 9 }]]
        }
      })
    ).toThrow(/level must be an integer 0–4/)
  })
})

describe('assertRecentPosts', () => {
  it('accepts a post list', () => {
    expect(
      assertRecentPosts([
        {
          slug: 'a',
          href: '/blog/posts/a/',
          title: 'A',
          description: 'd',
          date: '2026-01-01'
        }
      ])[0]?.slug
    ).toBe('a')
  })

  it('rejects a non-array root', () => {
    expect(() => assertRecentPosts({})).toThrow(/recent-posts must be an array/)
  })
})
