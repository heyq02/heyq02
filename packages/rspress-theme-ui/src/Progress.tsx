import { siteProgressFill, siteProgressTrack } from '@heyq02/site-ui'
import type { ReactElement } from 'react'

import { cx } from './cx.ts'

export function Progress({
  value,
  className,
  trackClassName,
  fillClassName
}: {
  /** 0–100. Omit for indeterminate / fixed-width fills via `fillClassName`. */
  value?: number
  className?: string
  trackClassName?: string
  fillClassName?: string
}): ReactElement {
  const width = typeof value === 'number' ? `${Math.max(0, Math.min(100, value))}%` : undefined
  return (
    <span className={cx(siteProgressTrack, trackClassName, className)}>
      {/* Dynamic bar width cannot be a static style object. */}
      {/* oxlint-disable-next-line react-perf/jsx-no-new-object-as-prop */}
      <span className={cx(siteProgressFill, fillClassName)} style={width ? { width } : undefined} />
    </span>
  )
}
