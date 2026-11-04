import { useEffect } from 'react'

import { intro } from '../lib/intro.ts'

/** One console greeting, Anthony Fu–style. */
export default function SiteEasterEgg(): null {
  useEffect(() => {
    // Intentional easter egg for visitors who open DevTools.
    console.info(
      `%c${intro.kaomoji}  你好，我是${intro.name}\n%c${intro.bio}\n%c→ ${intro.site}`,
      'font-size:18px;font-weight:700',
      'color:#888',
      'color:#0095ff'
    )
  }, [])

  return null
}
