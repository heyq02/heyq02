import type { ReactElement } from 'react'

import {
  siteCardName,
  siteCardSummary,
  siteH2,
  siteSection,
  siteTile,
  siteWhen
} from '../../lib/site-ui.ts'
import { likesData } from '../likes-data.ts'
import { PageShell } from './shared.tsx'

const accents: Record<string, string> = {
  uses: 'from-[color-mix(in_oklab,var(--rp-c-brand)_18%,transparent)] to-transparent',
  music: 'from-[color-mix(in_oklab,var(--rp-c-brand-light)_22%,transparent)] to-transparent',
  games: 'from-[color-mix(in_oklab,var(--rp-c-brand-dark)_20%,transparent)] to-transparent',
  watching: 'from-[color-mix(in_oklab,var(--rp-c-brand-tint)_28%,transparent)] to-transparent',
  visits: 'from-[color-mix(in_oklab,var(--rp-c-link)_20%,transparent)] to-transparent',
  reading: 'from-[color-mix(in_oklab,var(--rp-c-gray)_22%,transparent)] to-transparent'
}

const glyphs: Record<string, string> = {
  uses: '⌘',
  music: '♪',
  games: '▶',
  watching: '▣',
  visits: '⌖',
  reading: '¶'
}

/** Hub as a bento of differently weighted category doors. */
export function Hub({ ssgMd }: { ssgMd: boolean }): ReactElement {
  const { title, intro, categories } = likesData
  return (
    <PageShell title={title} intro={intro} ssgMd={ssgMd} tone='likes-hub'>
      <section className={siteSection}>
        {ssgMd ? (
          <>
            <h2 className={siteH2}>分类</h2>
            <ul>
              {categories.map(category => (
                <li key={category.id}>
                  <a href={category.href}>{category.title}</a>
                  {` — ${category.desc}`}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className='gap-rp-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6'>
            {categories.map((category, index) => {
              const wide = index === 0 || index === 1
              return (
                <a
                  key={category.id}
                  href={category.href}
                  data-card=''
                  className={[
                    `group p-rp-4 hover:shadow-rp relative overflow-hidden ${siteTile}`,
                    wide
                      ? 'sm:col-span-1 lg:col-span-3 min-h-[calc(var(--rp-radius-large)*6)]'
                      : 'lg:col-span-2 min-h-[calc(var(--rp-radius-large)*5.5)]',
                    `bg-gradient-to-br ${accents[category.id] ?? accents.uses}`
                  ].join(' ')}
                >
                  <span className='top-rp-3 right-rp-3 text-rp-2xl text-rp-muted pointer-events-none absolute font-mono opacity-40 transition-opacity group-hover:opacity-70'>
                    {glyphs[category.id] ?? '·'}
                  </span>
                  <span className='gap-rp-3 grid h-full content-between'>
                    <span className='gap-rp-1 grid'>
                      <span className={siteCardName}>{category.title}</span>
                      <span className={`max-w-xs ${siteCardSummary}`}>{category.desc}</span>
                    </span>
                    <span className={siteWhen}>{category.countLabel}</span>
                  </span>
                </a>
              )
            })}
          </div>
        )}
      </section>
    </PageShell>
  )
}
