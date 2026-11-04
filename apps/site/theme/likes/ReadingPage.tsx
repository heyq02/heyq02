import type { ReactElement } from 'react'

import { siteCardName, siteCardSummary, siteH2, siteSection, siteWhen } from '../../lib/site-ui.ts'
import { likesData } from '../likes-data.ts'
import type { ShelfItem } from '../likes-data.ts'
import { BackLink, ItemLink, PageShell, badgeClass } from './shared.tsx'

const spineColors = [
  'bg-[color-mix(in_oklab,var(--rp-c-brand)_55%,#1f2937)]',
  'bg-[color-mix(in_oklab,#2563eb_50%,#111827)]',
  'bg-[color-mix(in_oklab,#7c3aed_45%,#111827)]',
  'bg-[color-mix(in_oklab,#0f766e_50%,#111827)]',
  'bg-[color-mix(in_oklab,#b45309_45%,#111827)]'
]

/** Bookshelf: open books with progress + spine rail for the rest. */
export function ReadingPage({ ssgMd }: { ssgMd: boolean }): ReactElement {
  const shelf = likesData.reading
  const current = shelf.sections.find(section => section.id === 'current')?.items ?? []
  const queue = shelf.sections.find(section => section.id === 'queue')?.items ?? []

  if (ssgMd) {
    return (
      <PageShell title={shelf.title} intro={shelf.intro} ssgMd tone='likes-reading'>
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
      </PageShell>
    )
  }

  return (
    <PageShell title={shelf.title} intro={shelf.intro} ssgMd={false} tone='likes-reading'>
      <BackLink />

      <section className={siteSection}>
        <h2 className={siteH2}>摊开在读</h2>
        <div className='grid gap-3'>
          {current.map(item => (
            <OpenBook key={item.title} item={item} />
          ))}
        </div>
      </section>

      <section className={siteSection}>
        <h2 className={siteH2}>书架</h2>
        <div className='overflow-x-auto rounded-[var(--rp-radius-small)] border border-[var(--rp-c-divider-light)] bg-[var(--rp-c-bg-soft)] p-4'>
          <ul className='m-0 flex h-[13.5rem] list-none items-end gap-2 p-0'>
            {queue.map((item, index) => (
              <li key={item.title} className='m-0'>
                <Spine item={item} color={spineColors[index % spineColors.length]} />
              </li>
            ))}
          </ul>
          <p className={`mt-3 mb-0 ${siteWhen}`}>横滑看脊背；点开看作者和短评。</p>
        </div>

        <ul className='mt-4 mb-0 grid list-none gap-2 p-0'>
          {queue.map(item => (
            <li key={`detail-${item.title}`} className='m-0'>
              <BookRow item={item} />
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  )
}

function OpenBook({ item }: { item: ShelfItem }): ReactElement {
  const progress = typeof item.progress === 'number' ? item.progress : 0
  return (
    <ItemLink
      href={item.href}
      className='group grid gap-3 rounded-[var(--rp-radius-small)] border border-[var(--rp-c-divider-light)] bg-[var(--rp-c-bg-soft)] p-4 no-underline hover:border-[var(--rp-c-brand)] hover:!no-underline sm:grid-cols-[auto_minmax(0,1fr)]'
    >
      <span className='flex h-[8.5rem] w-[6rem] items-end justify-center rounded-sm border border-[var(--rp-c-divider)] bg-[var(--rp-c-bg)] px-2 py-3 shadow-[var(--rp-shadow-1)]'>
        <span className='line-clamp-4 text-center text-[0.78rem] leading-snug font-semibold text-[var(--rp-c-text-1)]'>
          {item.title}
        </span>
      </span>
      <span className='grid content-center gap-2'>
        <span className='flex flex-wrap items-baseline justify-between gap-2'>
          <span className='text-[1.15rem] font-bold tracking-[-0.01em] text-[var(--rp-c-text-1)]'>
            {item.title}
          </span>
          {item.label ? <span className={badgeClass}>{item.label}</span> : null}
        </span>
        {item.subtitle ? <span className={siteWhen}>{item.subtitle}</span> : null}
        <span className={siteCardSummary}>{item.note}</span>
        <span className='grid gap-1'>
          <span className='flex justify-between font-[family-name:var(--rp-font-family-mono)] text-[0.72rem] text-[var(--rp-c-text-2)]'>
            <span>进度</span>
            <span>{progress}%</span>
          </span>
          <span className='h-2 overflow-hidden rounded-full bg-[var(--rp-c-divider-light)]'>
            <span
              className='block h-full rounded-full bg-[var(--rp-c-brand)]'
              style={{ width: `${progress}%` }}
            />
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
        'group flex h-[12rem] w-[2.55rem] items-center justify-center rounded-sm border border-black/10 px-1 py-2 text-white no-underline shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:!no-underline',
        color
      ].join(' ')}
    >
      <span className='line-clamp-1 max-h-full rotate-180 text-[0.72rem] font-semibold tracking-wide [writing-mode:vertical-rl]'>
        {item.title}
      </span>
    </ItemLink>
  )
}

function BookRow({ item }: { item: ShelfItem }): ReactElement {
  return (
    <ItemLink
      href={item.href}
      className='group grid gap-1 rounded-[var(--rp-radius-small)] border border-transparent px-2 py-2 no-underline hover:border-[var(--rp-c-divider-light)] hover:bg-[var(--rp-c-bg-soft)] hover:!no-underline sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline'
    >
      <span className='grid min-w-0 gap-0.5'>
        <span className={`truncate ${siteCardName}`}>{item.title}</span>
        <span className={`truncate ${siteCardSummary}`}>
          {[item.subtitle, item.note].filter(Boolean).join(' · ')}
        </span>
      </span>
      <span className='flex flex-wrap gap-1.5'>
        {item.label ? <span className={badgeClass}>{item.label}</span> : null}
        {typeof item.score === 'number' ? (
          <span className={siteWhen}>{item.score.toFixed(1)}</span>
        ) : null}
      </span>
    </ItemLink>
  )
}
