/** @vitest-environment jsdom */
import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, expect, it, vi } from 'vite-plus/test'

vi.mock('../chrome.css', () => ({}))

vi.mock('@rspress/core/theme-original', () => ({
  HomeFooter: () => <footer data-testid='home-footer'>footer</footer>,
  Layout: ({ bottom, children }: { bottom?: ReactNode; children?: ReactNode }) => (
    <div data-testid='basic-layout'>
      {bottom}
      {children}
    </div>
  )
}))

afterEach(cleanup)

it('mounts watermark, SiteEasterEgg and HomeFooter in Layout', async () => {
  const info = vi.spyOn(console, 'info').mockImplementation(() => {})
  const { Layout } = await import('../index.tsx')
  const { container } = render(<Layout />)
  expect(container.querySelector('.site-watermark')).toBeTruthy()
  expect(screen.getByTestId('basic-layout')).toBeTruthy()
  expect(screen.getByTestId('home-footer')).toBeTruthy()
  expect(info).toHaveBeenCalled()
  info.mockRestore()
})
