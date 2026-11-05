import { useEffect } from 'react'

/**
 * Ensure `#hey-main` exists for the skip link on pages that don't set it
 * (blog / doc layouts). Profile and friends already own the id.
 */
export function MainLandmark(): null {
  useEffect(() => {
    if (document.querySelector('#hey-main')) {
      return
    }
    const el = document.querySelector('main') ?? document.querySelector('.rp-doc-layout__doc')
    if (!(el instanceof HTMLElement)) {
      return
    }
    el.id = 'hey-main'
    el.tabIndex = -1
  }, [])

  return null
}
