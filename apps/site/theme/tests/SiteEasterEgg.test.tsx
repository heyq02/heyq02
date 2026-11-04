/** @vitest-environment jsdom */
import { cleanup, render } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vite-plus/test'

import { SiteEasterEgg } from '../SiteEasterEgg.tsx'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

it('logs a Chinese console greeting', () => {
  const info = vi.spyOn(console, 'info').mockImplementation(() => {})
  render(<SiteEasterEgg />)
  expect(info).toHaveBeenCalledTimes(1)
  const [message] = info.mock.calls[0] as [string]
  expect(message).toContain('你好，我是')
  expect(message).not.toContain("hi, I'm")
})
