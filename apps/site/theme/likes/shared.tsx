import { siteBody, siteH1, siteHeaderRule, siteLink, sitePageRoot } from '@heyq02/site-ui'
import type { ReactElement, ReactNode } from 'react'

export { siteBadge as badgeClass } from '@heyq02/site-ui'

export function PageShell({
  title,
  intro,
  children,
  ssgMd,
  tone = ''
}: {
  title: string
  intro: string
  children: ReactNode
  ssgMd: boolean
  /** Extra class on root for category-specific chrome hooks. */
  tone?: string
}): ReactElement {
  return (
    <div className={`likes ${tone} ${sitePageRoot}`.trim()}>
      <header className={siteHeaderRule}>
        {ssgMd ? null : <h1 className={siteH1}>{title}</h1>}
        <p className={`mt-rp-3 ${siteBody}`}>{intro}</p>
      </header>
      {children}
    </div>
  )
}

export function BackLink(): ReactElement {
  return (
    <p className={`mt-rp-4 mb-0 ${siteBody}`}>
      <a className={siteLink} href='/likes/'>
        ← 返回兴趣
      </a>
    </p>
  )
}

export function ItemLink({
  href,
  className,
  children
}: {
  href?: string
  className: string
  children: ReactNode
}): ReactElement {
  if (!href) {
    return <div className={className}>{children}</div>
  }
  const external = /^https?:\/\//.test(href)
  return (
    <a
      className={className}
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      data-card=''
    >
      {children}
    </a>
  )
}
