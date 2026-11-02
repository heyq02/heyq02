import { expect, it } from 'vite-plus/test'

// English nav is a tracked template under i18n/; blogs/en itself is build output.
import zhNav from '../blogs/zh/_nav.json' with { type: 'json' }
import enNav from '../i18n/en/_nav.json' with { type: 'json' }

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
    const active = enNav
      .filter(item => item.activeMatch && isActive(item.activeMatch, pathname))
      .map(item => item.text)
    expect(active).toHaveLength(1)
  }

  expect(enNav.find(item => item.activeMatch && isActive(item.activeMatch, '/'))?.text).toBe('Home')
  expect(
    enNav.find(item => item.activeMatch && isActive(item.activeMatch, '/index.html'))?.text
  ).toBe('Home')
  expect(
    enNav.find(item => item.activeMatch && isActive(item.activeMatch, '/friends.html'))?.text
  ).toBe('Friends')
  expect(
    enNav.find(item => item.activeMatch && isActive(item.activeMatch, '/blog/index.html'))?.text
  ).toBe('Blog')
})

it('keeps Travellings as an external nav link', () => {
  for (const nav of [enNav, zhNav]) {
    const travellings = nav.find(item => item.text === 'Travellings')
    expect(travellings?.link).toBe('https://www.travellings.cn/go.html')
    expect(travellings?.activeMatch).toBeUndefined()
  }
})

it('translates the Chinese navbar labels', () => {
  expect(zhNav.map(item => item.text)).toEqual(['首页', '博客', '友链', 'Travellings'])
})
