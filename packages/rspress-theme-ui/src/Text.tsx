import type { HTMLAttributes, ReactElement, ReactNode } from 'react'

import { cx } from './cx.ts'
import {
  siteBody,
  siteCardName,
  siteCardSummary,
  siteDisplay,
  siteMeta,
  siteWhen
} from './tokens.ts'

type SpanProps = {
  children: ReactNode
  className?: string
} & HTMLAttributes<HTMLSpanElement>

type PProps = {
  children: ReactNode
  className?: string
} & HTMLAttributes<HTMLParagraphElement>

export function Body({ children, className, ...rest }: PProps): ReactElement {
  return (
    <p className={cx(siteBody, className)} {...rest}>
      {children}
    </p>
  )
}

export function Meta({ children, className, ...rest }: SpanProps): ReactElement {
  return (
    <span className={cx(siteMeta, className)} {...rest}>
      {children}
    </span>
  )
}

export function When({ children, className, ...rest }: PProps): ReactElement {
  return (
    <p className={cx(siteWhen, className)} {...rest}>
      {children}
    </p>
  )
}

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

export function Display({ children, className, ...rest }: SpanProps): ReactElement {
  return (
    <span className={cx(siteDisplay, className)} {...rest}>
      {children}
    </span>
  )
}
