/** @vitest-environment jsdom */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vite-plus/test'

vi.mock('../friends-page.ts', () => ({
  friendsData: {
    title: '友链',
    intro: '你好',
    exchange: {
      title: '交换友链',
      body: '发邮件给我',
      self: {
        name: '我',
        url: 'https://example.com',
        avatar: 'https://example.com/a.png',
        desc: '简介'
      }
    },
    friends: []
  }
}))

afterEach(cleanup)

it('shows empty state when no friends are listed', async () => {
  const { FriendsPage } = await import('../FriendsPage.tsx')
  render(<FriendsPage ssgMd={false} />)
  expect(screen.getByText(/还没有友链/)).toBeTruthy()
})
