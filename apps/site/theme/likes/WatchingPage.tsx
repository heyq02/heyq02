import type { ReactElement } from 'react'

import { siteCardName, siteCardSummary, siteH2, siteSection, siteWhen } from '../../lib/site-ui.ts'
import { likesData } from '../likes-data.ts'
import type { ShelfItem } from '../likes-data.ts'
import { BackLink, ItemLink, PageShell, badgeClass } from './shared.tsx'

/** Cinema layout: horizontal now-watching rail + dense poster wall. */
export function WatchingPage({ ssgMd }: { ssgMd: boolean }): ReactElement {
  const shelf = likesData.watching
  const now = shelf.sections.find(section => section.id === 'now')?.items ?? []
  const favorites = shelf.sections.find(section => section.id === 'favorites')?.items ?? []

  if (ssgMd) {
    return (
      <PageShell title={shelf.title} intro={shelf.intro} ssgMd tone='likes-watching'>
        <BackLink />
        {shelf.sections.map(section => (
          <div key={section.id}>
            <h2 className={siteH2}>{section.title}</h2>
            <ul>
              {section.items.map(item => (
                <li key={item.title}>
                  {item.href ? <a href={item.href}>{item.title}</a> : item.title}
                  {item.note ? ` — ${item.note}` : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </PageShell>
    )
  }

  return (
    <PageShell title={shelf.title} intro={shelf.intro} ssgMd={false} tone='likes-watching'>
      <BackLink />

      <section className={siteSection}>
        <h2 className={siteH2}>正在看</h2>
        <ul className='m-0 flex list-none gap-4 overflow-x-auto p-0 pb-2'>
          {now.map(item => (
            <li key={item.title} className='m-0 w-[14rem] shrink-0 sm:w-[16rem]'>
              <NowCard item={item} />
            </li>
          ))}
        </ul>
      </section>

      <section className={siteSection}>
        <h2 className={siteH2}>常安利海报墙</h2>
        <ul className='m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 md:grid-cols-6'>
          {favorites.map(item => (
            <li key={item.title} className='m-0 min-w-0'>
              <Poster item={item} />
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  )
}

function NowCard({ item }: { item: ShelfItem }): ReactElement {
  return (
    <ItemLink href={item.href} className='group grid gap-2.5 no-underline hover:!no-underline'>
      <span className='relative block aspect-[2/3] overflow-hidden rounded-[var(--rp-radius-small)] border border-[var(--rp-c-brand)] shadow-[var(--rp-shadow-1)]'>
        {item.cover ? (
          <img
            className='size-full object-cover transition-transform duration-300 group-hover:scale-[1.04]'
            src={item.cover}
            alt=''
            loading='lazy'
          />
        ) : null}
        <span className='absolute top-2 left-2 rounded bg-[var(--rp-c-brand)] px-2 py-0.5 text-[0.7rem] font-semibold text-white'>
          NOW
        </span>
      </span>
      <span className='grid gap-1'>
        <span className={siteCardName}>{item.title}</span>
        <span className='flex flex-wrap gap-1.5'>
          {item.label ? <span className={badgeClass}>{item.label}</span> : null}
          {typeof item.year === 'number' ? <span className={siteWhen}>{item.year}</span> : null}
          {typeof item.score === 'number' ? (
            <span className={badgeClass}>{item.score.toFixed(1)}</span>
          ) : null}
        </span>
        <span className={`line-clamp-3 ${siteCardSummary}`}>{item.note}</span>
      </span>
    </ItemLink>
  )
}

function Poster({ item }: { item: ShelfItem }): ReactElement {
  return (
    <ItemLink href={item.href} className='group grid gap-2 no-underline hover:!no-underline'>
      <span className='relative block aspect-[2/3] overflow-hidden rounded-[var(--rp-radius-small)] border border-[var(--rp-c-divider-light)] bg-[var(--rp-c-bg-soft)]'>
        {item.cover ? (
          <img
            className='size-full object-cover transition-transform duration-200 group-hover:scale-[1.05]'
            src={item.cover}
            alt=''
            loading='lazy'
          />
        ) : null}
        {typeof item.score === 'number' ? (
          <span className='absolute right-1.5 bottom-1.5 rounded bg-black/70 px-1.5 py-0.5 font-[family-name:var(--rp-font-family-mono)] text-[0.68rem] text-white'>
            {item.score.toFixed(1)}
          </span>
        ) : null}
      </span>
      <span className='grid gap-0.5'>
        <span className={`line-clamp-2 text-[0.92rem] ${siteCardName}`}>{item.title}</span>
        <span className={siteWhen}>{[item.label, item.year].filter(Boolean).join(' · ')}</span>
      </span>
    </ItemLink>
  )
}
