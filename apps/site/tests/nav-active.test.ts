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

  expect(nav.find(item => item.activeMatch && isActive(item.activeMatch, '/'))?.text).toBe('Home')
  expect(
    nav.find(item => item.activeMatch && isActive(item.activeMatch, '/index.html'))?.text
  ).toBe('Home')
  expect(
    nav.find(item => item.activeMatch && isActive(item.activeMatch, '/friends.html'))?.text
  ).toBe('Friends')
  expect(
    nav.find(item => item.activeMatch && isActive(item.activeMatch, '/blog/index.html'))?.text
  ).toBe('Blog')
})

it('keeps Travellings as an external nav link', () => {
  const travellings = nav.find(item => item.text === 'Travellings')
  expect(travellings?.link).toBe('https://www.travellings.cn/go.html')
  expect(travellings?.activeMatch).toBeUndefined()
})
