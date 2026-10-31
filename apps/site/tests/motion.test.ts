/** @vitest-environment happy-dom */
import { afterEach, expect, it, vi } from 'vite-plus/test'

afterEach(() => {
  vi.resetModules()
  document.documentElement.removeAttribute('style')
})

it('uses the stylesheet fallback when the document is unavailable', async () => {
  vi.resetModules()
  vi.stubGlobal('getComputedStyle', null)

  const motion = await import('../src/motion.ts')
  expect(motion.easeOutQuart()).toEqual([0.16, 1, 0.3, 1])
  expect(motion.riseDuration()).toBe(0.42)

  vi.unstubAllGlobals()
})

it('reads ease and duration design tokens', async () => {
  const root = document.documentElement
  root.style.setProperty('--ease-out-quart', 'cubic-bezier(0.16, 1, 0.3, 1)')
  root.style.setProperty('--transition-duration-slow', '420ms')

  const motion = await import('../src/motion.ts')
  expect(motion.easeOutQuart()).toEqual([0.16, 1, 0.3, 1])
  expect(motion.riseDuration()).toBe(0.42)
  expect(motion.easeOutQuart()).toEqual([0.16, 1, 0.3, 1])
  expect(motion.riseDuration()).toBe(0.42)
})

it('parses second-based duration tokens', async () => {
  const root = document.documentElement
  root.style.setProperty('--ease-out-quart', 'cubic-bezier(0.16, 1, 0.3, 1)')
  root.style.setProperty('--transition-duration-slow', '0.5s')

  const motion = await import('../src/motion.ts')
  expect(motion.riseDuration()).toBe(0.5)
})

it('rejects missing or invalid design tokens', async () => {
  document.documentElement.removeAttribute('style')
  const motion = await import('../src/motion.ts')
  expect(() => motion.easeOutQuart()).toThrow(/Missing design token/)

  document.documentElement.style.setProperty('--ease-out-quart', 'ease')
  expect(() => motion.easeOutQuart()).toThrow(/not a cubic-bezier/)
})
