import type { ReactElement } from 'react'

import { siteCardName, siteCardSummary, siteH2, siteSection, siteWhen } from '../../lib/site-ui.ts'
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
          <ol className='relative m-0 grid list-none gap-4 p-0 before:absolute before:top-2 before:bottom-2 before:left-[0.55rem] before:w-px before:bg-[var(--rp-c-divider-light)] sm:before:left-[0.7rem]'>
            {section.items.map(item => (
              <li key={item.title} className='relative m-0 pl-7 sm:pl-9'>
                <span className='absolute top-5 left-0 size-3 rounded-full border-2 border-[var(--rp-c-brand)] bg-[var(--rp-c-bg)]' />
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
        'group grid overflow-hidden rounded-[var(--rp-radius-small)] border border-[var(--rp-c-divider-light)] bg-[var(--rp-c-bg-soft)] no-underline sm:grid-cols-[6.5rem_minmax(0,1fr)]',
        'transition-[border-color,box-shadow] duration-200 hover:border-[var(--rp-c-brand)] hover:shadow-[var(--rp-shadow-1)] hover:!no-underline',
        upcoming ? 'border-dashed' : ''
      ].join(' ')}
    >
      <span className='relative grid content-center gap-1 border-b border-dashed border-[var(--rp-c-divider)] bg-[color-mix(in_oklab,var(--rp-c-brand)_10%,var(--rp-c-bg-soft))] px-3 py-4 sm:border-r sm:border-b-0'>
        <span className='font-[family-name:var(--rp-font-family-mono)] text-[0.68rem] tracking-[0.14em] text-[var(--rp-c-text-2)] uppercase'>
          {upcoming ? 'PLAN' : 'TICKET'}
        </span>
        <span className='text-[0.95rem] font-semibold text-[var(--rp-c-text-1)]'>
          {item.date && item.date.length > 0 ? item.date : '待定'}
        </span>
        <span className={siteWhen}>
          {item.place && item.place.length > 0 ? item.place : item.label}
        </span>
        <span className='pointer-events-none absolute top-1/2 -right-1.5 hidden size-3 -translate-y-1/2 rounded-full bg-[var(--rp-c-bg)] shadow-[inset_0_0_0_1px_var(--rp-c-divider-light)] sm:block' />
      </span>

      <span className='grid gap-3 p-3 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:items-center'>
        {item.cover ? (
          <img
            className='aspect-[4/3] w-full rounded-[calc(var(--rp-radius-small)-2px)] object-cover'
            src={item.cover}
            alt=''
            loading='lazy'
          />
        ) : null}
        <span className='grid gap-1.5'>
          <span className='flex flex-wrap items-baseline justify-between gap-2'>
            <span className={siteCardName}>{item.title}</span>
            {item.label ? <span className={badgeClass}>{item.label}</span> : null}
          </span>
          <span className={siteCardSummary}>{item.note}</span>
          {item.tags && item.tags.length > 0 ? (
            <span className='flex flex-wrap gap-1'>
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
