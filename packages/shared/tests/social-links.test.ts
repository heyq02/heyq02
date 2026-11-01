import { expect, it } from 'vite-plus/test'

import { intro, socialLinksFrom } from '../src/index.ts'

it('puts social links in the navbar list', () => {
  const links = socialLinksFrom(intro.places)
  expect(links.find(link => link.icon === 'github')).toMatchObject({
    mode: 'link',
    content: 'https://github.com/heyq02'
  })
  expect(links.find(link => link.icon === 'x')).toMatchObject({
    mode: 'link',
    content: 'https://x.com/heyq02'
  })
  expect(links.find(link => link.icon === 'wechat')).toMatchObject({
    mode: 'img',
    content: '/wechat.jpg'
  })
  expect(links.map(link => link.content)).toEqual([
    'https://github.com/heyq02',
    'https://x.com/heyq02',
    'https://space.bilibili.com/3493273159075938',
    '/wechat.jpg'
  ])
  expect(
    socialLinksFrom([{ label: 'Unknown', href: 'https://example.com' }]).some(
      link => link.content === 'https://example.com'
    )
  ).toBe(false)
})
