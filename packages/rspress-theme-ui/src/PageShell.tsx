import type { ReactElement, ReactNode } from 'react'

import { cx } from './cx.ts'
import { siteBody, siteH1, siteHeaderRule, sitePageRoot } from './tokens.ts'

export function PageShell({
  title,
  intro,
  children,
  ssgMd = false,
  tone = '',
  rootClassName = ''
}: {
  title: string
  intro?: string
  children: ReactNode
  ssgMd?: boolean
  /** Extra class on root for page-specific chrome hooks (e.g. `friends`). */
  tone?: string
  rootClassName?: string
}): ReactElement {
  return (
    <div className={cx(tone, sitePageRoot, rootClassName).trim()}>
      <header className={siteHeaderRule}>
        {ssgMd ? null : <h1 className={siteH1}>{title}</h1>}
        {intro ? <p className={cx('mt-rp-3', siteBody)}>{intro}</p> : null}
      </header>
      {children}
    </div>
  )
}
