import { useEffect } from 'react'

import { intro } from '../lib/intro.ts'

/** One console greeting for visitors who open DevTools. */
export function SiteEasterEgg(): null {
  useEffect(() => {
    const lead = intro.bio.split(/\n\n/)[0] ?? intro.bio
    // Intentional easter egg for visitors who open DevTools.
    // oxlint-disable-next-line no-console
    console.info(
      `%c${intro.kaomoji}  老师好，我是${intro.name}\n%c${lead}\n%c无限进步 → ${intro.site}`,
      'font-size:18px;font-weight:700;font-family:LXGW WenKai,serif',
      'color:#6b7785',
      'color:#c47a1a'
    )
  }, [])

  return null
}
