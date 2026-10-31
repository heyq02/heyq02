/** @vitest-environment jsdom */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vite-plus/test'

import { friendsData } from '../friends-page.ts'
import { FriendsPage } from '../FriendsPage.tsx'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

it('renders friends grid and exchange block', () => {
  render(<FriendsPage ssgMd={false} />)
  expect(screen.getByRole('heading', { name: friendsData.title })).toBeTruthy()
  expect(screen.queryByText('Links')).toBeNull()
  expect(screen.getByText(/Shuffled on each visit/)).toBeTruthy()
  expect(screen.getByRole('heading', { name: friendsData.exchange.title })).toBeTruthy()
  if (friendsData.friends[0]) {
    expect(screen.getByText(friendsData.friends[0].name)).toBeTruthy()
  }
})

it('snapshots friends card DOM with a stable shuffle', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0)
  const { container } = render(<FriendsPage ssgMd={false} />)
  const card = container.querySelector('a[data-card]')
  expect(card).toBeTruthy()
  expect(card?.outerHTML).toMatchSnapshot('friend-card.html')
  expect(container.querySelector('.friends-grid')?.innerHTML).toMatchSnapshot('friends-grid.html')
})

it('renders Agent-friendly markdown chrome for SSG-MD', () => {
  render(<FriendsPage ssgMd />)
  expect(screen.queryByRole('heading', { name: friendsData.title })).toBeNull()
  expect(screen.getByText(`Name: ${friendsData.exchange.self.name}`)).toBeTruthy()
})
