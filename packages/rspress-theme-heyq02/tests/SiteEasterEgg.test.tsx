/** @vitest-environment jsdom */
import { cleanup, render } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vite-plus/test'

import { SiteEasterEgg } from '../SiteEasterEgg.tsx'

afterEach(cleanup)

it('logs a console greeting on mount', () => {
  const info = vi.spyOn(console, 'info').mockImplementation(() => {})
  render(<SiteEasterEgg />)
  expect(info).toHaveBeenCalled()
  info.mockRestore()
})
