/** @vitest-environment jsdom */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vite-plus/test'

import { friendsData } from '../friends-page.ts'
import { FriendsPage } from '../FriendsPage.tsx'

afterEach(cleanup)

it('renders friends grid and exchange block', () => {
  render(<FriendsPage ssgMd={false} />)
  expect(screen.getByRole('heading', { name: friendsData.title })).toBeTruthy()
  expect(screen.getByText(friendsData.kicker)).toBeTruthy()
  expect(screen.getByText(/Shuffled on each visit/)).toBeTruthy()
  expect(screen.getByRole('heading', { name: friendsData.exchange.title })).toBeTruthy()
  if (friendsData.friends[0]) {
    expect(screen.getByText(friendsData.friends[0].name)).toBeTruthy()
  }
})

it('renders Agent-friendly markdown chrome for SSG-MD', () => {
  render(<FriendsPage ssgMd />)
  expect(screen.queryByRole('heading', { name: friendsData.title })).toBeNull()
  expect(screen.getByText(`Name: ${friendsData.exchange.self.name}`)).toBeTruthy()
})
