import {
  siteCardName,
  siteCardSummary,
  siteDisplay,
  siteFocusRing,
  siteH2,
  siteMeta,
  siteProgressFill,
  siteProgressTrack,
  siteRow,
  siteSection,
  siteSurface,
  siteTile,
  siteWhen
} from '@heyq02/rspress-theme-ui'
import type { ReactElement } from 'react'

import { likesData } from '../likes-data.ts'
import type { ShelfItem } from '../likes-data.ts'
import { BackLink, ItemLink, LikesShell, badgeClass } from './shared.tsx'

/** Primer semantic emphasis fills for bookshelf spines. */
const spineColors = [
  'bg-[var(--bgColor-accent-emphasis)]',
  'bg-[var(--bgColor-success-emphasis)]',
  'bg-[var(--bgColor-done-emphasis)]',
  'bg-[var(--bgColor-attention-emphasis)]',
  'bg-[var(--bgColor-severe-emphasis)]'
]

/** Bookshelf: open books with progress + spine rail for the rest. */
export function ReadingPage({ ssgMd }: { ssgMd: boolean }): ReactElement {
  const shelf = likesData.reading
  const current = shelf.sections.find(section => section.id === 'current')?.items ?? []
  const queue = shelf.sections.find(section => section.id === 'queue')?.items ?? []

  if (ssgMd) {
    return (
      <LikesShell title={shelf.title} intro={shelf.intro} ssgMd tone='likes-reading'>
        <BackLink />
        {shelf.sections.map(section => (
          <div key={section.id}>
            <h2 className={siteH2}>{section.title}</h2>
            <ul>
              {section.items.map(item => (
                <li key={item.title}>
                  {item.href ? <a href={item.href}>{item.title}</a> : item.title}
                  {` — ${[item.subtitle, item.note].filter(Boolean).join(' · ')}`}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </LikesShell>
    )
  }

  return (
    <LikesShell title={shelf.title} intro={shelf.intro} ssgMd={false} tone='likes-reading'>
      <BackLink />

      <section className={siteSection}>
        <h2 className={siteH2}>摊开在读</h2>
        <div className='gap-rp-3 grid'>
          {current.map(item => (
            <OpenBook key={item.title} item={item} />
          ))}
        </div>
      </section>

      <section className={siteSection}>
        <h2 className={siteH2}>书架</h2>
        <div className={`p-rp-4 overflow-x-auto ${siteSurface}`}>
          <ul className='gap-rp-2 m-0 flex h-[calc(var(--rp-radius-large)*8.5)] list-none items-end p-0'>
            {queue.map((item, index) => (
              <li key={item.title} className='m-0'>
                <Spine item={item} color={spineColors[index % spineColors.length]} />
              </li>
            ))}
          </ul>
        </div>

        <ul className='mt-rp-4 gap-rp-2 mb-0 grid list-none p-0'>
          {queue.map(item => (
            <li key={`detail-${item.title}`} className='m-0'>
              <BookRow item={item} />
            </li>
          ))}
        </ul>
      </section>
    </LikesShell>
  )
}

function OpenBook({ item }: { item: ShelfItem }): ReactElement {
  const progress = typeof item.progress === 'number' ? item.progress : 0
  return (
    <ItemLink
      href={item.href}
      className={`group gap-rp-3 p-rp-4 grid sm:grid-cols-[auto_minmax(0,1fr)] ${siteTile}`}
    >
      <span className='rounded-rp-sm border-rp-divider bg-rp-bg px-rp-2 py-rp-3 shadow-rp flex h-[calc(var(--rp-radius-large)*5.5)] w-[calc(var(--rp-radius-large)*4)] items-end justify-center border'>
        <span className='text-rp-sm text-rp-text line-clamp-4 text-center leading-snug font-semibold'>
          {item.title}
        </span>
      </span>
      <span className='gap-rp-2 grid content-center'>
        <span className='gap-rp-2 flex flex-wrap items-baseline justify-between'>
          <span className={siteDisplay}>{item.title}</span>
          {item.label ? <span className={badgeClass}>{item.label}</span> : null}
        </span>
        {item.subtitle ? <span className={siteWhen}>{item.subtitle}</span> : null}
        <span className={siteCardSummary}>{item.note}</span>
        <span className='gap-rp-1 grid'>
          <span className={`flex justify-between ${siteMeta}`}>
            <span>进度</span>
            <span>{progress}%</span>
          </span>
          <span className={`h-2 ${siteProgressTrack}`}>
            <span className={siteProgressFill} style={{ width: `${progress}%` }} />
          </span>
        </span>
      </span>
    </ItemLink>
  )
}

function Spine({ item, color }: { item: ShelfItem; color: string }): ReactElement {
  return (
    <ItemLink
      href={item.href}
      className={[
        `group rounded-rp-sm px-rp-1 py-rp-2 shadow-rp flex h-[calc(var(--rp-radius-large)*8)] w-[calc(var(--rp-radius-small)*5)] items-center justify-center border border-black/10 text-white no-underline transition-transform duration-200 hover:-translate-y-1 hover:!no-underline ${siteFocusRing}`,
        color
      ].join(' ')}
    >
      <span className='text-rp-xs line-clamp-1 max-h-full rotate-180 font-semibold tracking-wide [writing-mode:vertical-rl]'>
        {item.title}
      </span>
    </ItemLink>
  )
}

function BookRow({ item }: { item: ShelfItem }): ReactElement {
  return (
    <ItemLink
      href={item.href}
      className={`group gap-rp-1 px-rp-2 py-rp-2 grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline ${siteRow}`}
    >
      <span className='gap-rp-1 grid min-w-0'>
        <span className={`truncate ${siteCardName}`}>{item.title}</span>
        <span className={`truncate ${siteCardSummary}`}>
          {[item.subtitle, item.note].filter(Boolean).join(' · ')}
        </span>
      </span>
      <span className='gap-rp-1 flex flex-wrap'>
        {item.label ? <span className={badgeClass}>{item.label}</span> : null}
        {typeof item.score === 'number' ? (
          <span className={siteWhen}>{item.score.toFixed(1)}</span>
        ) : null}
      </span>
    </ItemLink>
  )
}
