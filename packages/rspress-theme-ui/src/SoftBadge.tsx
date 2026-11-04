import { siteBadge } from '@heyq02/site-ui'
import type { HTMLAttributes, ReactElement, ReactNode } from 'react'

import { cx } from './cx.ts'

export function SoftBadge({
  children,
  className,
  ...rest
}: {
  children: ReactNode
  className?: string
} & HTMLAttributes<HTMLSpanElement>): ReactElement {
  return (
    <span className={cx(siteBadge, className)} {...rest}>
      {children}
    </span>
  )
}
