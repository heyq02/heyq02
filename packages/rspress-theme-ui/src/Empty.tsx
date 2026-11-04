import { siteEmpty } from '@heyq02/site-ui'
import type { HTMLAttributes, ReactElement, ReactNode } from 'react'

import { cx } from './cx.ts'

export function Empty({
  children,
  className,
  ...rest
}: {
  children: ReactNode
  className?: string
} & HTMLAttributes<HTMLParagraphElement>): ReactElement {
  return (
    <p className={cx(siteEmpty, className)} {...rest}>
      {children}
    </p>
  )
}
