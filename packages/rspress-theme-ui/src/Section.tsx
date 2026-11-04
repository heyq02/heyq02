import type { ReactElement, ReactNode } from 'react'

import { cx } from './cx.ts'
import { siteH2, siteH2Plain, siteSection } from './tokens.ts'

export function Section({
  title,
  children,
  className,
  titleClassName,
  marker = '',
  plainTitle = false
}: {
  title?: string
  children: ReactNode
  className?: string
  titleClassName?: string
  /** Extra class on section for page hooks (e.g. `profile-section`). */
  marker?: string
  /** Drop the brand underline — magazine / home layouts. */
  plainTitle?: boolean
}): ReactElement {
  return (
    <section className={cx(marker, siteSection, className)}>
      {title ? (
        <h2 className={cx(plainTitle ? siteH2Plain : siteH2, titleClassName)}>{title}</h2>
      ) : null}
      {children}
    </section>
  )
}
