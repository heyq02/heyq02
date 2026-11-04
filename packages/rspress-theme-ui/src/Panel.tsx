import type { HTMLAttributes, ReactElement, ReactNode } from 'react'

import { cx } from './cx.ts'
import { sitePanelChrome } from './tokens.ts'

export function Panel({
  children,
  className,
  ...rest
}: {
  children: ReactNode
  className?: string
} & HTMLAttributes<HTMLDivElement>): ReactElement {
  return (
    <div className={cx(sitePanelChrome, className)} {...rest}>
      {children}
    </div>
  )
}
