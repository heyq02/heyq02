import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'

const storageKey = 'heyq02-theme'

function readDark(): boolean {
  if (typeof document === 'undefined') {
    return false
  }
  return document.documentElement.classList.contains('dark')
}

/** Light / dark toggle that persists in localStorage. */
export function ThemeToggle(): ReactElement {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(readDark())
  }, [])

  const toggle = () => {
    const next = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem(storageKey, next ? 'dark' : 'light')
    setDark(next)
  }

  return (
    <button
      type='button'
      className='rounded-[var(--site-radius-small)] border border-[var(--site-divider-light)] bg-[var(--site-bg-soft)] px-2.5 py-1 text-[0.8rem] text-[var(--site-text-2)] transition-colors hover:text-[var(--site-brand)]'
      onClick={toggle}
      aria-label={dark ? '切换到浅色模式' : '切换到深色模式'}
      title={dark ? '浅色' : '深色'}
    >
      {dark ? '浅色' : '深色'}
    </button>
  )
}
