import {
  siteCardName,
  siteCardSummary,
  siteH2,
  siteMeta,
  siteSection,
  siteTile,
  siteWhen
} from '@heyq02/site-ui'
import type { ReactElement } from 'react'

import { likesData } from '../likes-data.ts'
import type { ShelfItem } from '../likes-data.ts'
import { BackLink, ItemLink, PageShell, badgeClass } from './shared.tsx'

/** Exhibition tickets on a timeline — not a travel photo dump. */
export function VisitsPage({ ssgMd }: { ssgMd: boolean }): ReactElement {
  const shelf = likesData.visits

  if (ssgMd) {
    return (
      <PageShell title={shelf.title} intro={shelf.intro} ssgMd tone='likes-visits'>
        <BackLink />
        {shelf.sections.map(section => (
          <div key={section.id}>
            <h2 className={siteH2}>{section.title}</h2>
            <ul>
              {section.items.map(item => (
                <li key={item.title}>
                  {item.href ? <a href={item.href}>{item.title}</a> : item.title}
                  {` — ${[item.place, item.date, item.note].filter(Boolean).join(' · ')}`}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </PageShell>
    )
  }

  return (
    <PageShell title={shelf.title} intro={shelf.intro} ssgMd={false} tone='likes-visits'>
      <BackLink />
      {shelf.sections.map(section => (
        <section key={section.id} className={siteSection}>
          <h2 className={siteH2}>{section.title}</h2>
          <ol className='gap-rp-4 before:top-rp-2 before:bottom-rp-2 before:bg-rp-divider-light relative m-0 grid list-none p-0 before:absolute before:left-[0.55rem] before:w-px sm:before:left-[0.7rem]'>
            {section.items.map(item => (
              <li key={item.title} className='pl-rp-8 sm:pl-rp-10 relative m-0'>
                <span className='top-rp-5 border-rp-brand bg-rp-bg absolute left-0 size-3 rounded-full border-2' />
                <Ticket item={item} upcoming={section.id === 'want'} />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </PageShell>
  )
}

function Ticket({ item, upcoming }: { item: ShelfItem; upcoming: boolean }): ReactElement {
  return (
    <ItemLink
      href={item.href}
      className={[
        `group hover:shadow-rp grid overflow-hidden sm:grid-cols-[6.5rem_minmax(0,1fr)] ${siteTile}`,
        upcoming ? 'border-dashed' : ''
      ].join(' ')}
    >
      <span className='gap-rp-1 border-rp-divider px-rp-3 py-rp-4 relative grid content-center border-b border-dashed bg-[color-mix(in_oklab,var(--rp-c-brand)_10%,var(--rp-c-bg-soft))] sm:border-r sm:border-b-0'>
        <span className={`tracking-[0.14em] uppercase ${siteMeta}`}>
          {upcoming ? 'PLAN' : 'TICKET'}
        </span>
        <span className='text-rp-md text-rp-text font-semibold'>
          {item.date && item.date.length > 0 ? item.date : '待定'}
        </span>
        <span className={siteWhen}>
          {item.place && item.place.length > 0 ? item.place : item.label}
        </span>
        <span className='-right-rp-1 bg-rp-bg pointer-events-none absolute top-1/2 hidden size-3 -translate-y-1/2 rounded-full shadow-[inset_0_0_0_1px_var(--rp-c-divider-light)] sm:block' />
      </span>

      <span className='gap-rp-3 p-rp-3 grid sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:items-center'>
        {item.cover ? (
          <img
            className='rounded-rp-sm aspect-[4/3] w-full object-cover'
            src={item.cover}
            alt=''
            loading='lazy'
          />
        ) : null}
        <span className='gap-rp-1 grid'>
          <span className='gap-rp-2 flex flex-wrap items-baseline justify-between'>
            <span className={siteCardName}>{item.title}</span>
            {item.label ? <span className={badgeClass}>{item.label}</span> : null}
          </span>
          <span className={siteCardSummary}>{item.note}</span>
          {item.tags && item.tags.length > 0 ? (
            <span className='gap-rp-1 flex flex-wrap'>
              {item.tags.map(tag => (
                <span key={tag} className={badgeClass}>
                  {tag}
                </span>
              ))}
            </span>
          ) : null}
        </span>
      </span>
    </ItemLink>
  )
}
