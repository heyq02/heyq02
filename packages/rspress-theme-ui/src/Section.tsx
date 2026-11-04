import type { ReactElement, ReactNode } from 'react'

import { cx } from './cx.ts'
import { siteH2, siteSection } from './tokens.ts'

export function Section({
  title,
  children,
  className,
  titleClassName,
  marker = ''
}: {
  title?: string
  children: ReactNode
  className?: string
  titleClassName?: string
  /** Extra class on section for page hooks (e.g. `profile-section`). */
  marker?: string
}): ReactElement {
  return (
    <section className={cx(marker, siteSection, className)}>
      {title ? <h2 className={cx(siteH2, titleClassName)}>{title}</h2> : null}
      {children}
    </section>
  )
}
