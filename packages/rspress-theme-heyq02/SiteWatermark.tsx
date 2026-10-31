import type { ReactElement } from 'react'

/** Huge diagonal “无限进步” mark behind the page chrome. */
export function SiteWatermark(): ReactElement {
  return (
    <div className='site-watermark' aria-hidden='true'>
      <img className='site-watermark__mark' src='/wuxian-jinbu.png' alt='' />
    </div>
  )
}
