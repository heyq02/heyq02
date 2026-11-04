import type { ReactElement } from 'react'

import './watermark.css'

export interface WatermarkProps {
  /** Public URL of the watermark image. */
  src: string
}

/** Huge diagonal mark behind the page chrome; never interactive. */
export default function Watermark({ src }: WatermarkProps): ReactElement {
  return (
    <div className='rp-plugin-watermark' aria-hidden='true'>
      <img className='rp-plugin-watermark__mark' src={src} alt='' />
    </div>
  )
}
