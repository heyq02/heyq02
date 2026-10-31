import { useEffect } from 'react'

import { intro } from '../src/intro.ts'

/** One console greeting, Anthony Fu–style. */
export function SiteEasterEgg(): null {
  useEffect(() => {
    // Intentional easter egg for visitors who open DevTools.
    // oxlint-disable-next-line no-console
    console.info(
      `%c${intro.kaomoji}  hi, I'm ${intro.name}\n%c${intro.bio}\n%c→ ${intro.site}`,
      'font-size:18px;font-weight:700',
      'color:#888',
      'color:#0095ff'
    )
  }, [])

  return null
}
