import {
  CardLink,
  CardSummary,
  CardTitle,
  Section,
  siteCardChrome,
  siteWhen
} from '@heyq02/rspress-theme-ui'
import type { ReactElement } from 'react'

import { likesData } from '../likes-data.ts'
import { LikesShell } from './shared.tsx'

const glyphs: Record<string, string> = {
  uses: '⌘',
  music: '♪',
  watching: '▣',
  visits: '⌖',
  reading: '¶'
}

/** Hub as a bento of differently weighted category doors. */
export function Hub({ ssgMd }: { ssgMd: boolean }): ReactElement {
  const { title, intro, categories } = likesData
  return (
    <LikesShell title={title} intro={intro} ssgMd={ssgMd} tone='likes-hub'>
      <Section title={ssgMd ? '分类' : undefined}>
        {ssgMd ? (
          <ul>
            {categories.map(category => (
              <li key={category.id}>
                <a href={category.href}>{category.title}</a>
                {` — ${category.desc}`}
              </li>
            ))}
          </ul>
        ) : (
          <div className='gap-rp-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6'>
            {categories.map((category, index) => {
              const wide = index === 0 || index === 1
              return (
                <CardLink
                  key={category.id}
                  href={category.href}
                  external={false}
                  className={[
                    `relative overflow-hidden ${siteCardChrome}`,
                    wide
                      ? 'sm:col-span-1 lg:col-span-3 min-h-[calc(var(--rp-radius-large)*6)]'
                      : 'lg:col-span-2 min-h-[calc(var(--rp-radius-large)*5.5)]'
                  ].join(' ')}
                >
                  <span className='top-rp-3 right-rp-3 text-rp-2xl text-rp-muted pointer-events-none absolute font-mono opacity-40 transition-opacity group-hover:opacity-70'>
                    {glyphs[category.id] ?? '·'}
                  </span>
                  <span className='gap-rp-3 grid h-full content-between'>
                    <span className='gap-rp-1 grid'>
                      <CardTitle>{category.title}</CardTitle>
                      <CardSummary className='max-w-xs'>{category.desc}</CardSummary>
                    </span>
                    <span className={siteWhen}>{category.countLabel}</span>
                  </span>
                </CardLink>
              )
            })}
          </div>
        )}
      </Section>
    </LikesShell>
  )
}
