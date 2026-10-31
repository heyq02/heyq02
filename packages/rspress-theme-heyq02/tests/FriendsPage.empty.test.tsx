/** @vitest-environment jsdom */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vite-plus/test'

vi.mock('../friends-page.ts', () => ({
  friendsData: {
    title: 'Friends',
    intro: 'Hello',
    exchange: {
      title: 'Exchange',
      body: 'Mail me',
      self: {
        name: 'Self',
        url: 'https://example.com',
        avatar: 'https://example.com/a.png',
        desc: 'Me'
      }
    },
    friends: []
  }
}))

afterEach(cleanup)

it('shows empty state when no friends are listed', async () => {
  const { FriendsPage } = await import('../FriendsPage.tsx')
  render(<FriendsPage ssgMd={false} />)
  expect(screen.getByText(/No friends listed yet/)).toBeTruthy()
})
