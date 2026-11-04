import { useLayoutEffect } from 'react'

const LIGHT_THEME = 'light'
const DARK_THEME = 'dark'

function syncPrimerColorMode(root: HTMLElement): void {
  root.dataset.lightTheme = LIGHT_THEME
  root.dataset.darkTheme = DARK_THEME
  const dark = root.classList.contains('dark') || root.classList.contains('rp-dark')
  root.dataset.colorMode = dark ? DARK_THEME : LIGHT_THEME
}

/** Keep Primer `[data-color-mode]` in sync with Rspress `.dark` / `.rp-dark`. */
export function PrimerColorMode(): null {
  useLayoutEffect(() => {
    const root = document.documentElement
    syncPrimerColorMode(root)
    const observer = new MutationObserver(() => {
      syncPrimerColorMode(root)
    })
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => {
      observer.disconnect()
    }
  }, [])

  return null
}
