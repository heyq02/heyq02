/** @vitest-environment jsdom */
import { cleanup, render } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vite-plus/test'

vi.mock('../static/watermark.css', () => ({}))

afterEach(cleanup)

it('renders a decorative image with the configured src', async () => {
  const { default: Watermark } = await import('../static/Watermark.tsx')
  const { container } = render(<Watermark src='/wuxian-jinbu.png' />)
  const root = container.querySelector('.rp-plugin-watermark')
  expect(root?.getAttribute('aria-hidden')).toBe('true')
  const img = container.querySelector('img.rp-plugin-watermark__mark')
  expect(img?.getAttribute('src')).toBe('/wuxian-jinbu.png')
  expect(img?.getAttribute('alt')).toBe('')
})
