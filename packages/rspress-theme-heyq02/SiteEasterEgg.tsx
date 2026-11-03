import { intro } from '@heyq02/shared'
import { useEffect } from 'react'

/** One console greeting, Anthony Fu–style. */
export function SiteEasterEgg(): null {
  useEffect(() => {
    // Intentional easter egg for visitors who open DevTools.
    // oxlint-disable-next-line no-console
    console.info(
      `%c${intro.kaomoji}  你好，我是${intro.name}\n%c${intro.bio}\n%c→ ${intro.site}`,
      'font-size:18px;font-weight:700',
      'color:#888',
      'color:#0095ff'
    )
  }, [])

  return null
}
