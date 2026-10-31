import { expect, it } from 'vite-plus/test'

import { friendsData, friendsList } from '../src/friends-page.ts'

it('loads friend links from the shared JSON', () => {
  expect(friendsData.title).toBe('Friends')
  expect(friendsData.kicker).toBe('Links')
  expect(friendsData.exchange.self.url).toBe('https://heyq02.com')
  expect(friendsData.exchange.self.avatar).toContain('avatars.githubusercontent.com')

  const friends = friendsList()
  expect(friends.length).toBeGreaterThan(0)
  expect(friends[0]).toMatchObject({
    name: expect.any(String),
    blog: expect.any(String),
    url: expect.stringMatching(/^https?:\/\//),
    avatar: expect.stringMatching(/^https?:\/\//)
  })
  expect(friends.every(friend => !('desc' in friend) || typeof friend.desc === 'string')).toBe(true)
  expect(friends.some(friend => friend.url.includes('diygod'))).toBe(true)
  expect(friends.some(friend => friend.url.includes('yunyoujun'))).toBe(true)
})
