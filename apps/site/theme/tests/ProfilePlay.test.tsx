import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vite-plus/test'

/** @vitest-environment jsdom */
import { intro } from '../../lib/intro.ts'
import { ProfilePlay } from '../ProfilePlay.tsx'

afterEach(cleanup)

it('renders hero avatar and cycles mood on poke', () => {
  render(<ProfilePlay tags={<span>tag</span>} ssgMd={false} />)
  expect(screen.getByRole('heading', { name: intro.name })).toBeTruthy()
  const poke = screen.getByRole('button', { name: '戳一下头像' })
  expect(poke.getAttribute('title')).toBe('戳我')
  fireEvent.click(poke)
  expect(poke.className).toContain('profile-avatar-button--spin')
  fireEvent.animationEnd(poke)
  expect(poke.className).not.toContain('profile-avatar-button--spin')
  const mood = screen.getByRole('button', { name: '换一个表情' })
  expect(mood.getAttribute('title')).toBe('点一下换个表情')
  fireEvent.click(mood)
})

it('renders markdown-friendly output for SSG-MD', () => {
  const { container } = render(<ProfilePlay tags={<span>tag</span>} ssgMd />)
  expect(container.textContent).toContain(`![${intro.name}](${intro.avatar})`)
  expect(container.textContent).toContain(intro.kaomoji)
})
