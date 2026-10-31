/** @vitest-environment jsdom */
import { intro } from '@heyq02/shared'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vite-plus/test'

import { ProfilePlay } from '../ProfilePlay.tsx'

afterEach(cleanup)

it('renders hero avatar and cycles mood on poke', () => {
  render(<ProfilePlay tags={<span>tag</span>} ssgMd={false} />)
  expect(screen.getByRole('heading', { name: intro.name })).toBeTruthy()
  const poke = screen.getByRole('button', { name: 'Poke the avatar' })
  fireEvent.click(poke)
  expect(poke.className).toContain('profile-avatar-button--spin')
  fireEvent.animationEnd(poke)
  expect(poke.className).not.toContain('profile-avatar-button--spin')
  fireEvent.click(screen.getByRole('button', { name: 'Change mood' }))
})

it('renders markdown-friendly output for SSG-MD', () => {
  const { container } = render(<ProfilePlay tags={<span>tag</span>} ssgMd />)
  expect(container.textContent).toContain(`![${intro.name}](${intro.avatar})`)
  expect(container.textContent).toContain(intro.kaomoji)
})

it('uses default ssgMd from import.meta.env when omitted', () => {
  render(<ProfilePlay tags={<span>tag</span>} />)
  expect(screen.getByRole('heading', { name: intro.name })).toBeTruthy()
})
