import type { ReactElement, ReactNode } from 'react'

import { cx } from './cx.ts'
import { siteBody, siteH1, siteHeaderRule, siteMeta, sitePageRoot } from './tokens.ts'

export function PageShell({
  title,
  intro,
  children,
  ssgMd = false,
  tone = '',
  rootClassName = '',
  tip
}: {
  title: string
  intro: string
  children: ReactNode
  ssgMd?: boolean
  /** Extra class on root for page-specific chrome hooks (e.g. `likes`, `friends`). */
  tone?: string
  rootClassName?: string
  /** Optional mono tip under intro (hidden in SSG-MD). */
  tip?: string
}): ReactElement {
  return (
    <div className={cx(tone, sitePageRoot, rootClassName).trim()}>
      <header className={siteHeaderRule}>
        {ssgMd ? null : <h1 className={siteH1}>{title}</h1>}
        <p className={cx('mt-rp-3', siteBody)}>{intro}</p>
        {tip && !ssgMd ? <p className={cx('mt-rp-2 mb-0', siteMeta)}>{tip}</p> : null}
      </header>
      {children}
    </div>
  )
}
