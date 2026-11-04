import type { ReactElement, ReactNode } from 'react'

import { siteBody, siteH1, siteHeaderRule, siteLink, sitePageRoot } from '../../lib/site-ui.ts'

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
        <p className={`mt-3 ${siteBody}`}>{intro}</p>
      </header>
      {children}
    </div>
  )
}

export function BackLink(): ReactElement {
  return (
    <p className={`mt-4 mb-0 ${siteBody}`}>
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

export const badgeClass =
  'inline-flex items-center rounded-full border border-[var(--rp-c-divider-light)] bg-[var(--rp-c-bg)] px-2 py-[0.1rem] text-[0.72rem] leading-none text-[var(--rp-c-text-2)]'
