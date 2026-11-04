import type { ReactElement } from 'react'

import { siteCardName, siteCardSummary, siteH2, siteSection, siteWhen } from '../../lib/site-ui.ts'
import { likesData } from '../likes-data.ts'
import type { ShelfItem } from '../likes-data.ts'
import { BackLink, ItemLink, PageShell, badgeClass } from './shared.tsx'

/** Game library: featured now-playing banners + compact shelf tiles. */
export function GamesPage({ ssgMd }: { ssgMd: boolean }): ReactElement {
  const shelf = likesData.games
  const playing = shelf.sections.find(section => section.id === 'playing')?.items ?? []
  const paused = shelf.sections.find(section => section.id === 'paused')?.items ?? []

  if (ssgMd) {
    return (
      <PageShell title={shelf.title} intro={shelf.intro} ssgMd tone='likes-games'>
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
    <PageShell title={shelf.title} intro={shelf.intro} ssgMd={false} tone='likes-games'>
      <BackLink />

      <section className={siteSection}>
        <h2 className={siteH2}>正在开黑</h2>
        <div className='grid gap-3'>
          {playing.map(item => (
            <NowPlaying key={item.title} item={item} />
          ))}
        </div>
      </section>

      <section className={siteSection}>
        <h2 className={siteH2}>游戏库</h2>
        <ul className='m-0 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-4'>
          {paused.map(item => (
            <li key={item.title} className='m-0 min-w-0'>
              <LibraryTile item={item} />
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  )
}

function NowPlaying({ item }: { item: ShelfItem }): ReactElement {
  return (
    <ItemLink
      href={item.href}
      className='group relative grid min-h-[11rem] overflow-hidden rounded-[var(--rp-radius-small)] border border-[var(--rp-c-divider-light)] no-underline hover:border-[var(--rp-c-brand)] hover:!no-underline sm:min-h-[13rem]'
    >
      {item.cover ? (
        <img
          className='absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]'
          src={item.cover}
          alt=''
          loading='lazy'
        />
      ) : null}
      <span className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10' />
      <span className='relative z-[1] grid content-end gap-2 p-4 text-white'>
        <span className='flex flex-wrap gap-2'>
          <span className='rounded-full bg-white/15 px-2 py-0.5 text-[0.72rem] backdrop-blur-sm'>
            {item.label}
          </span>
          {typeof item.hours === 'number' ? (
            <span className='rounded-full bg-white/15 px-2 py-0.5 text-[0.72rem] backdrop-blur-sm'>
              {item.hours}h
            </span>
          ) : null}
          {typeof item.score === 'number' ? (
            <span className='rounded-full bg-white/15 px-2 py-0.5 text-[0.72rem] backdrop-blur-sm'>
              {item.score.toFixed(1)}
            </span>
          ) : null}
        </span>
        <span className='text-[1.35rem] font-bold tracking-[-0.02em]'>{item.title}</span>
        <span className='max-w-[36rem] text-[0.95rem] leading-relaxed text-white/85'>
          {item.note}
        </span>
      </span>
    </ItemLink>
  )
}

function LibraryTile({ item }: { item: ShelfItem }): ReactElement {
  return (
    <ItemLink href={item.href} className='group grid gap-2 no-underline hover:!no-underline'>
      <span className='relative block aspect-[16/10] overflow-hidden rounded-[var(--rp-radius-small)] border border-[var(--rp-c-divider-light)] bg-[var(--rp-c-bg-soft)]'>
        {item.cover ? (
          <img
            className='size-full object-cover transition-transform duration-200 group-hover:scale-[1.04]'
            src={item.cover}
            alt=''
            loading='lazy'
          />
        ) : null}
        {typeof item.hours === 'number' ? (
          <span className='absolute right-2 bottom-2 rounded bg-black/65 px-1.5 py-0.5 font-[family-name:var(--rp-font-family-mono)] text-[0.68rem] text-white'>
            {item.hours}h
          </span>
        ) : null}
      </span>
      <span className='grid gap-0.5'>
        <span className={`line-clamp-1 ${siteCardName}`}>{item.title}</span>
        <span className='flex flex-wrap items-center gap-1.5'>
          {item.label ? <span className={badgeClass}>{item.label}</span> : null}
          {typeof item.score === 'number' ? (
            <span className={siteWhen}>{item.score.toFixed(1)}</span>
          ) : null}
        </span>
        <span className={`line-clamp-2 ${siteCardSummary}`}>{item.note}</span>
      </span>
    </ItemLink>
  )
}
