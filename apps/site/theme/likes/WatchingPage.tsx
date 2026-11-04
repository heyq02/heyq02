import type { ReactElement } from 'react'

import {
  siteCardName,
  siteCardSummary,
  siteH2,
  siteSection,
  siteSurface,
  siteWhen
} from '../../lib/site-ui.ts'
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
        <ul className='gap-rp-4 pb-rp-2 m-0 flex list-none overflow-x-auto p-0'>
          {now.map(item => (
            <li
              key={item.title}
              className='m-0 w-[calc(var(--rp-radius-large)*9)] shrink-0 sm:w-[calc(var(--rp-radius-large)*10)]'
            >
              <NowCard item={item} />
            </li>
          ))}
        </ul>
      </section>

      <section className={siteSection}>
        <h2 className={siteH2}>常安利海报墙</h2>
        <ul className='gap-rp-3 m-0 grid list-none grid-cols-2 p-0 sm:grid-cols-3 md:grid-cols-6'>
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
    <ItemLink href={item.href} className='group gap-rp-2 grid no-underline hover:!no-underline'>
      <span className='rounded-rp-sm border-rp-brand shadow-rp relative block aspect-[2/3] overflow-hidden border'>
        {item.cover ? (
          <img
            className='size-full object-cover transition-transform duration-300 group-hover:scale-[1.04]'
            src={item.cover}
            alt=''
            loading='lazy'
          />
        ) : null}
        <span className='top-rp-2 left-rp-2 rounded-rp-sm bg-rp-brand px-rp-2 py-rp-1 text-rp-xs absolute font-semibold text-white'>
          NOW
        </span>
      </span>
      <span className='gap-rp-1 grid'>
        <span className={siteCardName}>{item.title}</span>
        <span className='gap-rp-1 flex flex-wrap'>
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
    <ItemLink href={item.href} className='group gap-rp-2 grid no-underline hover:!no-underline'>
      <span className={`relative block aspect-[2/3] overflow-hidden ${siteSurface}`}>
        {item.cover ? (
          <img
            className='size-full object-cover transition-transform duration-200 group-hover:scale-[1.05]'
            src={item.cover}
            alt=''
            loading='lazy'
          />
        ) : null}
        {typeof item.score === 'number' ? (
          <span className='right-rp-1 bottom-rp-1 rounded-rp-sm px-rp-1 py-rp-1 text-rp-xs absolute bg-black/70 font-mono text-white'>
            {item.score.toFixed(1)}
          </span>
        ) : null}
      </span>
      <span className='gap-rp-1 grid'>
        <span className={`line-clamp-2 ${siteCardName}`}>{item.title}</span>
        <span className={siteWhen}>{[item.label, item.year].filter(Boolean).join(' · ')}</span>
      </span>
    </ItemLink>
  )
}
