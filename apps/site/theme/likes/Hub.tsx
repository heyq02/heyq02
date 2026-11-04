import type { ReactElement } from 'react'

import {
  siteBody,
  siteCardName,
  siteCardSummary,
  siteH2,
  sitePanelChrome,
  siteSection,
  siteWhen
} from '../../lib/site-ui.ts'
import { likesData } from '../likes-data.ts'
import { PageShell } from './shared.tsx'

const accents: Record<string, string> = {
  uses: 'from-[color-mix(in_oklab,var(--rp-c-brand)_18%,transparent)] to-transparent',
  music: 'from-[color-mix(in_oklab,#7c6af2_22%,transparent)] to-transparent',
  games: 'from-[color-mix(in_oklab,#2bb673_20%,transparent)] to-transparent',
  watching: 'from-[color-mix(in_oklab,#e8a317_20%,transparent)] to-transparent',
  visits: 'from-[color-mix(in_oklab,#3b82f6_20%,transparent)] to-transparent',
  reading: 'from-[color-mix(in_oklab,#a855f7_18%,transparent)] to-transparent'
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
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6'>
            {categories.map((category, index) => {
              const wide = index === 0 || index === 1
              return (
                <a
                  key={category.id}
                  href={category.href}
                  data-card=''
                  className={[
                    'group relative overflow-hidden rounded-[var(--rp-radius-small)] border border-[var(--rp-c-divider-light)] bg-[var(--rp-c-bg-soft)] p-4 no-underline transition-[border-color,box-shadow,transform] duration-200 hover:border-[var(--rp-c-brand)] hover:shadow-[var(--rp-shadow-1)] hover:!no-underline',
                    wide
                      ? 'sm:col-span-1 lg:col-span-3 min-h-[9.5rem]'
                      : 'lg:col-span-2 min-h-[8.5rem]',
                    `bg-gradient-to-br ${accents[category.id] ?? accents.uses}`
                  ].join(' ')}
                >
                  <span className='pointer-events-none absolute top-3 right-3 font-[family-name:var(--rp-font-family-mono)] text-3xl text-[var(--rp-c-text-2)] opacity-40 transition-opacity group-hover:opacity-70'>
                    {glyphs[category.id] ?? '·'}
                  </span>
                  <span className='grid h-full content-between gap-3'>
                    <span className='grid gap-1'>
                      <span className={siteCardName}>{category.title}</span>
                      <span className={`max-w-[18rem] ${siteCardSummary}`}>{category.desc}</span>
                    </span>
                    <span className={siteWhen}>{category.countLabel}</span>
                  </span>
                </a>
              )
            })}
          </div>
        )}
      </section>
      {ssgMd ? null : (
        <p className={`mt-8 ${sitePanelChrome} ${siteBody}`}>
          每一类都有自己的版式：工作台、播放器、游戏库、海报墙、票根时间线、书架。数据在{' '}
          <code>static/data/likes.json</code>。
        </p>
      )}
    </PageShell>
  )
}
