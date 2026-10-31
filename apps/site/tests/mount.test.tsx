/** @vitest-environment happy-dom */
import { act, cleanup } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vite-plus/test'

import { applyDesignTokens } from './setup.ts'

afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
  vi.resetModules()
})

it('mounts into #root and syncs the theme-color meta', async () => {
  applyDesignTokens()
  document.head.innerHTML = '<meta name="theme-color" content="" />'
  document.body.innerHTML = '<div id="root"></div>'

  const { mount } = await import('../src/mount.tsx')
  await act(async () => {
    mount(<p>mounted</p>)
    await Promise.resolve()
  })

  expect(document.querySelector('#root')?.textContent).toBe('mounted')
  expect(document.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe(
    '#ffffff'
  )
})

it('no-ops when #root is missing', async () => {
  document.body.innerHTML = ''
  const { mount } = await import('../src/mount.tsx')
  expect(() => {
    mount(<p>missing</p>)
  }).not.toThrow()
})
