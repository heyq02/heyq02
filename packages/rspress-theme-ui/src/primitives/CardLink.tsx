import type { AnchorHTMLAttributes, ReactElement, ReactNode } from 'react'

import { cx } from '../foundation/cx.ts'

export function CardLink({
  href,
  children,
  className,
  external,
  ...rest
}: {
  href?: string
  children: ReactNode
  className?: string
  /** Force external attrs when `href` is present. Defaults to detecting http(s). */
  external?: boolean
} & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href' | 'children' | 'className'
>): ReactElement {
  const classes = cx('group', className)
  if (!href) {
    return <div className={classes}>{children}</div>
  }
  const isExternal = external ?? /^https?:\/\//.test(href)
  return (
    <a
      className={classes}
      href={href}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      data-card=''
      {...rest}
    >
      {children}
    </a>
  )
}
