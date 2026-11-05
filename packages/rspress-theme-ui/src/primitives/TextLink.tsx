import type { AnchorHTMLAttributes, ReactElement, ReactNode } from 'react'

import { cx } from './cx.ts'
import { siteLink } from './tokens.ts'

export function TextLink({
  href,
  children,
  className,
  external,
  ...rest
}: {
  href: string
  children: ReactNode
  className?: string
  /** Force external attrs; defaults to detecting http(s). */
  external?: boolean
} & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href' | 'children' | 'className'
>): ReactElement {
  const isExternal = external ?? /^https?:\/\//.test(href)
  return (
    <a
      className={cx(siteLink, className)}
      href={href}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  )
}
