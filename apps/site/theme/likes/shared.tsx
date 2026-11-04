import { Body, PageShell, TextLink } from '@heyq02/rspress-theme-ui'
import type { ReactElement, ReactNode } from 'react'

export { CardLink as ItemLink, siteBadge as badgeClass } from '@heyq02/rspress-theme-ui'

export function LikesShell({
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
  tone?: string
}): ReactElement {
  return (
    <PageShell
      title={title}
      intro={intro}
      ssgMd={ssgMd}
      tone={['likes', tone].filter(Boolean).join(' ')}
    >
      {children}
    </PageShell>
  )
}

export function BackLink(): ReactElement {
  return (
    <Body className='mt-rp-4 mb-0'>
      <TextLink href='/likes/' external={false}>
        ← 返回兴趣
      </TextLink>
    </Body>
  )
}
