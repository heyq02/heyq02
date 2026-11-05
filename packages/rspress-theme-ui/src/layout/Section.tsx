import type { ReactElement, ReactNode } from 'react'

import { cx } from '../foundation/cx.ts'
import { siteH2, siteSection } from '../foundation/tokens.ts'

export function Section({
  title,
  children,
  className,
  titleClassName,
  marker = '',
  titleSrOnly = false,
  id
}: {
  title?: string
  children: ReactNode
  className?: string
  titleClassName?: string
  /** Extra class on section for page hooks (e.g. `profile-section`). */
  marker?: string
  /** Keep heading for AT when the visual title lives elsewhere (e.g. JumpRail). */
  titleSrOnly?: boolean
  id?: string
}): ReactElement {
  return (
    <section id={id} className={cx(marker, siteSection, className)}>
      {title ? (
        <h2 className={cx(titleSrOnly ? 'sr-only' : siteH2, titleClassName)}>{title}</h2>
      ) : null}
      {children}
    </section>
  )
}
