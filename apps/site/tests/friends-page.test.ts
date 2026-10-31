import { intro } from '@heyq02/profile'
import { expect, it } from 'vite-plus/test'

import { friendsData } from '../src/friends-page.ts'

it('loads friend links from the shared JSON', () => {
  expect(friendsData.title).toBe('Friends')
  expect(friendsData.kicker).toBe('Links')
  expect(friendsData.exchange.self.name).toBe(intro.name)
  expect(friendsData.exchange.self.url).toBe(intro.site)
  expect(friendsData.exchange.self.avatar).toBe(intro.avatar)
  expect(friendsData.exchange.body).toContain(intro.contact.email)
  expect(friendsData.exchange.body).not.toContain('{email}')

  const friends = friendsData.friends
  expect(friends.length).toBeGreaterThan(0)
  expect(friends[0]).toMatchObject({
    name: expect.any(String),
    url: expect.stringMatching(/^https?:\/\//),
    avatar: expect.stringMatching(/^https?:\/\//)
  })
  expect(friends.every(friend => !('blog' in friend))).toBe(true)
  expect(friends.every(friend => !('desc' in friend) || typeof friend.desc === 'string')).toBe(true)
  expect(friends.some(friend => friend.url.includes('diygod'))).toBe(true)
  expect(friends.some(friend => friend.url.includes('yunyoujun'))).toBe(true)
})
