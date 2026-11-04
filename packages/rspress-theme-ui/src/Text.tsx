import type { HTMLAttributes, ReactElement, ReactNode } from 'react'

import { cx } from './cx.ts'
import { siteCardName, siteCardSummary } from './tokens.ts'

type SpanProps = {
  children: ReactNode
  className?: string
} & HTMLAttributes<HTMLSpanElement>

export function CardTitle({ children, className, ...rest }: SpanProps): ReactElement {
  return (
    <span className={cx(siteCardName, className)} {...rest}>
      {children}
    </span>
  )
}

export function CardSummary({ children, className, ...rest }: SpanProps): ReactElement {
  return (
    <span className={cx(siteCardSummary, className)} {...rest}>
      {children}
    </span>
  )
}
