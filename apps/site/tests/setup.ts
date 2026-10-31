/** @vitest-environment happy-dom */
import { beforeEach, vi } from 'vite-plus/test'

export function applyDesignTokens() {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  root.style.setProperty('--color-background', '#ffffff')
  root.style.setProperty('--color-grid', '#8080801a')
  root.style.setProperty('--color-meteor-head', '#12e5e5')
  root.style.setProperty('--color-meteor-tail', '#ff351a')
  root.style.setProperty('--ease-out-quart', 'cubic-bezier(0.16, 1, 0.3, 1)')
  root.style.setProperty('--transition-duration-slow', '420ms')
}

export function mockMatchMedia(reducedMotion: boolean) {
  if (typeof document === 'undefined') {
    return
  }

  vi.spyOn(globalThis, 'matchMedia').mockImplementation(
    query =>
      ({
        matches: reducedMotion && query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent() {
          return false
        }
      }) as unknown as MediaQueryList
  )
}

beforeEach(() => {
  applyDesignTokens()
  mockMatchMedia(true)
  Object.defineProperty(globalThis.navigator, 'language', {
    configurable: true,
    get: () => 'zh-CN'
  })
})
