import type { ReactElement } from 'react'

import {
  siteCardName,
  siteCardSummary,
  siteDisplay,
  siteH2,
  siteSection,
  siteSurface,
  siteWhen
} from '../../lib/site-ui.ts'
import { likesData } from '../likes-data.ts'
import type { ShelfItem } from '../likes-data.ts'
import { BackLink, ItemLink, PageShell, badgeClass } from './shared.tsx'

const overlayChip = 'rounded-full bg-white/15 px-rp-2 py-rp-1 text-rp-xs backdrop-blur-sm'

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
        <div className='gap-rp-3 grid'>
          {playing.map(item => (
            <NowPlaying key={item.title} item={item} />
          ))}
        </div>
      </section>

      <section className={siteSection}>
        <h2 className={siteH2}>游戏库</h2>
        <ul className='gap-rp-3 m-0 grid list-none grid-cols-2 p-0 md:grid-cols-4'>
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
      className='group rounded-rp-sm border-rp-divider-light hover:border-rp-brand relative grid min-h-[calc(var(--rp-radius-large)*7)] overflow-hidden border no-underline hover:!no-underline sm:min-h-[calc(var(--rp-radius-large)*8)]'
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
      <span className='gap-rp-2 p-rp-4 relative z-[1] grid content-end text-white'>
        <span className='gap-rp-2 flex flex-wrap'>
          <span className={overlayChip}>{item.label}</span>
          {typeof item.hours === 'number' ? (
            <span className={overlayChip}>{item.hours}h</span>
          ) : null}
          {typeof item.score === 'number' ? (
            <span className={overlayChip}>{item.score.toFixed(1)}</span>
          ) : null}
        </span>
        <span className={`${siteDisplay} text-white`}>{item.title}</span>
        <span className='max-w-rp text-rp-md leading-relaxed text-white/85'>{item.note}</span>
      </span>
    </ItemLink>
  )
}

function LibraryTile({ item }: { item: ShelfItem }): ReactElement {
  return (
    <ItemLink href={item.href} className='group gap-rp-2 grid no-underline hover:!no-underline'>
      <span className={`relative block aspect-[16/10] overflow-hidden ${siteSurface}`}>
        {item.cover ? (
          <img
            className='size-full object-cover transition-transform duration-200 group-hover:scale-[1.04]'
            src={item.cover}
            alt=''
            loading='lazy'
          />
        ) : null}
        {typeof item.hours === 'number' ? (
          <span className='right-rp-2 bottom-rp-2 rounded-rp-sm px-rp-1 py-rp-1 text-rp-xs absolute bg-black/65 font-mono text-white'>
            {item.hours}h
          </span>
        ) : null}
      </span>
      <span className='gap-rp-1 grid'>
        <span className={`line-clamp-1 ${siteCardName}`}>{item.title}</span>
        <span className='gap-rp-1 flex flex-wrap items-center'>
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
