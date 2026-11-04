import type { AnchorHTMLAttributes, ReactElement, ReactNode } from 'react'

import { cx } from './cx.ts'
import { siteCardChrome, siteMediaLink, siteRow, siteTile } from './tokens.ts'

export type CardLinkVariant = 'card' | 'tile' | 'row' | 'media' | 'plain'

const variantClass: Record<CardLinkVariant, string> = {
  card: siteCardChrome,
  tile: siteTile,
  row: siteRow,
  media: siteMediaLink,
  plain: ''
}

export function CardLink({
  href,
  children,
  className,
  variant = 'plain',
  external,
  ...rest
}: {
  href?: string
  children: ReactNode
  className?: string
  variant?: CardLinkVariant
  /** Force external attrs when `href` is present. Defaults to detecting http(s). */
  external?: boolean
} & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href' | 'children' | 'className'
>): ReactElement {
  const classes = cx('group', variantClass[variant], className)
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
