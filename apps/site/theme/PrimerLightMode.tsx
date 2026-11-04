import { useLayoutEffect } from 'react'

/** Pin Primer light tokens on `<html>` — site is light-only. */
export function PrimerLightMode(): null {
  useLayoutEffect(() => {
    const root = document.documentElement
    root.dataset.colorMode = 'light'
    root.dataset.lightTheme = 'light'
    root.dataset.darkTheme = 'dark'
  }, [])

  return null
}
