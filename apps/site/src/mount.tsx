import { StrictMode } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'

function syncThemeColor() {
  const background = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-background')
    .trim()
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', background)
}

export function mount(node: ReactNode) {
  const rootEl = document.querySelector('#root')
  if (!rootEl) {
    return
  }

  syncThemeColor()
  createRoot(rootEl).render(<StrictMode>{node}</StrictMode>)
}
