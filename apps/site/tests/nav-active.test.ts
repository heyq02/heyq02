import { expect, it } from 'vite-plus/test'

import nav from '../blogs/_nav.json' with { type: 'json' }

function isActive(activeMatch: string, pathname: string) {
  return new RegExp(activeMatch).test(pathname)
}

it('highlights exactly one nav item per route', () => {
  const paths = [
    '/',
    '/index.html',
    '/blog/',
    '/blog/index.html',
    '/blog/posts/macos-disable-ime-switching/',
    '/friends/',
    '/friends.html',
    '/friends/index.html'
  ]

  for (const pathname of paths) {
    const active = nav
      .filter(item => item.activeMatch && isActive(item.activeMatch, pathname))
      .map(item => item.text)
    expect(active).toHaveLength(1)
  }

  expect(nav.find(item => item.activeMatch && isActive(item.activeMatch, '/'))?.text).toBe('首页')
  expect(
    nav.find(item => item.activeMatch && isActive(item.activeMatch, '/index.html'))?.text
  ).toBe('首页')
  expect(
    nav.find(item => item.activeMatch && isActive(item.activeMatch, '/friends.html'))?.text
  ).toBe('友链')
  expect(
    nav.find(item => item.activeMatch && isActive(item.activeMatch, '/blog/index.html'))?.text
  ).toBe('博客')
})

it('keeps 开往 as an external nav link', () => {
  const travellings = nav.find(item => item.text === '开往')
  expect(travellings?.link).toBe('https://www.travellings.cn/go.html')
  expect(travellings?.activeMatch).toBeUndefined()
})

it('labels the navbar in Chinese', () => {
  expect(nav.map(item => item.text)).toEqual(['首页', '博客', '友链', '开往'])
})
