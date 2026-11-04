import type { ReactElement, ReactNode } from 'react'

import {
  siteBody,
  siteCardChrome,
  siteCardName,
  siteCardSummary,
  siteH1,
  siteH2,
  siteHeaderRule,
  siteLink,
  sitePageRoot,
  sitePanelChrome,
  siteSection,
  siteWhen
} from '../lib/site-ui.ts'
import { likesData, shelfOf } from './likes-data.ts'
import type { LikesCategoryId, MusicPlaylist, MusicTrack, Shelf, ShelfItem } from './likes-data.ts'

const coverPosterClass =
  'block aspect-[2/3] w-full rounded-[calc(var(--rp-radius-small)-2px)] object-cover bg-[var(--rp-c-bg)]'

const coverWideClass =
  'block aspect-[16/10] w-full rounded-[calc(var(--rp-radius-small)-2px)] object-cover bg-[var(--rp-c-bg)]'

const coverSquareClass =
  'block size-full rounded-[calc(var(--rp-radius-small)-2px)] object-cover bg-[var(--rp-c-bg)]'

const metaClass =
  'm-0 flex flex-wrap items-center gap-x-2 gap-y-1 font-[family-name:var(--rp-font-family-mono)] text-[0.72rem] font-medium tracking-[0.02em] text-[var(--rp-c-text-2)]'

const badgeClass =
  'inline-flex items-center rounded-full border border-[var(--rp-c-divider-light)] bg-[var(--rp-c-bg)] px-2 py-[0.1rem] text-[0.72rem] leading-none text-[var(--rp-c-text-2)]'

const gridPosterClass =
  'mb-0 grid list-none grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-3 p-0 sm:grid-cols-[repeat(auto-fill,minmax(10.5rem,1fr))]'

const gridWideClass =
  'mb-0 grid list-none grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-3 p-0'

const gridListClass = 'mb-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2'

const gridPlaylistClass =
  'mb-0 grid list-none grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-3 p-0'

function PageShell({
  title,
  intro,
  children,
  ssgMd
}: {
  title: string
  intro: string
  children: ReactNode
  ssgMd: boolean
}): ReactElement {
  return (
    <div className={`likes ${sitePageRoot}`}>
      <header className={siteHeaderRule}>
        {ssgMd ? null : <h1 className={siteH1}>{title}</h1>}
        <p className={`mt-3 ${siteBody}`}>{intro}</p>
      </header>
      {children}
    </div>
  )
}

function BackLink(): ReactElement {
  return (
    <p className={`mt-4 mb-0 ${siteBody}`}>
      <a className={siteLink} href='/likes/'>
        ← 返回兴趣
      </a>
    </p>
  )
}

function ItemLink({
  href,
  className,
  children
}: {
  href?: string
  className: string
  children: ReactNode
}): ReactElement {
  if (!href) {
    return <div className={className}>{children}</div>
  }
  const external = /^https?:\/\//.test(href)
  return (
    <a
      className={className}
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      data-card=''
    >
      {children}
    </a>
  )
}

function Score({ score }: { score?: number }): ReactElement | null {
  if (typeof score !== 'number') {
    return null
  }
  return <span className={badgeClass}>{score.toFixed(1)}</span>
}

function MetaLine({ item }: { item: ShelfItem }): ReactElement {
  return (
    <span className={metaClass}>
      {typeof item.year === 'number' ? <span>{item.year}</span> : null}
      {item.label ? <span className={badgeClass}>{item.label}</span> : null}
      <Score score={item.score} />
    </span>
  )
}

function TextCard({ item, ssgMd }: { item: ShelfItem; ssgMd: boolean }): ReactElement {
  if (ssgMd) {
    return (
      <li>
        {item.href ? <a href={item.href}>{item.title}</a> : item.title}
        {item.subtitle ? ` — ${item.subtitle}` : null}
        {item.label ? ` · ${item.label}` : null}
        {item.note ? ` — ${item.note}` : null}
      </li>
    )
  }

  return (
    <li className='m-0 min-w-0'>
      <ItemLink href={item.href} className={`group grid h-full gap-1.5 ${siteCardChrome}`}>
        <span className='flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1'>
          <span className={siteCardName}>{item.title}</span>
          {item.label ? <span className={siteWhen}>{item.label}</span> : null}
        </span>
        {item.subtitle ? <span className={siteWhen}>{item.subtitle}</span> : null}
        {item.note ? <span className={siteCardSummary}>{item.note}</span> : null}
      </ItemLink>
    </li>
  )
}

function CoverCard({
  item,
  wide,
  ssgMd
}: {
  item: ShelfItem
  wide: boolean
  ssgMd: boolean
}): ReactElement {
  if (ssgMd) {
    return (
      <li>
        {item.href ? <a href={item.href}>{item.title}</a> : item.title}
        {item.subtitle ? ` — ${item.subtitle}` : null}
        {typeof item.score === 'number' ? ` · ${item.score.toFixed(1)}` : null}
        {item.note ? ` — ${item.note}` : null}
      </li>
    )
  }

  return (
    <li className='m-0 min-w-0'>
      <ItemLink
        href={item.href}
        className={`group grid h-full gap-[0.65rem] ${siteCardChrome} !p-2.5`}
      >
        {item.cover ? (
          <img
            className={wide ? coverWideClass : coverPosterClass}
            src={item.cover}
            alt=''
            loading='lazy'
            decoding='async'
          />
        ) : null}
        <span className='grid min-w-0 gap-1 px-0.5 pb-0.5'>
          <span className={`line-clamp-2 ${siteCardName}`}>{item.title}</span>
          {item.subtitle ? <span className={siteWhen}>{item.subtitle}</span> : null}
          <MetaLine item={item} />
          {item.note ? (
            <span className={`line-clamp-3 ${siteCardSummary}`}>{item.note}</span>
          ) : null}
          {item.tags && item.tags.length > 0 ? (
            <span className='mt-0.5 flex flex-wrap gap-1'>
              {item.tags.map(tag => (
                <span key={tag} className={badgeClass}>
                  {tag}
                </span>
              ))}
            </span>
          ) : null}
        </span>
      </ItemLink>
    </li>
  )
}

function ShelfSections({
  shelf,
  layout,
  ssgMd
}: {
  shelf: Shelf
  layout: 'text' | 'poster' | 'wide'
  ssgMd: boolean
}): ReactElement {
  const gridClass =
    layout === 'text' ? gridListClass : layout === 'wide' ? gridWideClass : gridPosterClass

  return (
    <>
      {shelf.sections.map(section => (
        <section key={section.id} className={siteSection}>
          <h2 className={siteH2}>
            {section.title}
            <span className='ml-2 font-[family-name:var(--rp-font-family-mono)] text-[0.78rem] font-medium text-[var(--rp-c-text-2)]'>
              {section.items.length}
            </span>
          </h2>
          {ssgMd ? (
            <ul>
              {section.items.map(item =>
                layout === 'text' ? (
                  <TextCard key={`${section.id}-${item.title}`} item={item} ssgMd />
                ) : (
                  <CoverCard
                    key={`${section.id}-${item.title}`}
                    item={item}
                    wide={layout === 'wide'}
                    ssgMd
                  />
                )
              )}
            </ul>
          ) : (
            <ul className={gridClass}>
              {section.items.map(item =>
                layout === 'text' ? (
                  <TextCard key={`${section.id}-${item.title}`} item={item} ssgMd={false} />
                ) : (
                  <CoverCard
                    key={`${section.id}-${item.title}`}
                    item={item}
                    wide={layout === 'wide'}
                    ssgMd={false}
                  />
                )
              )}
            </ul>
          )}
        </section>
      ))}
    </>
  )
}

function TrackRow({ track, ssgMd }: { track: MusicTrack; ssgMd: boolean }): ReactElement {
  if (ssgMd) {
    return (
      <li>
        {`${track.rank}. `}
        {track.href ? <a href={track.href}>{track.title}</a> : track.title}
        {` — ${track.artist} · ${track.plays} 次`}
      </li>
    )
  }

  return (
    <li className='m-0 min-w-0'>
      <ItemLink
        href={track.href}
        className={`group grid grid-cols-[1.5rem_3rem_1fr_auto] items-center gap-3 ${siteCardChrome} !py-2.5 !pr-3 !pl-3`}
      >
        <span className='text-center font-[family-name:var(--rp-font-family-mono)] text-[0.85rem] text-[var(--rp-c-text-2)]'>
          {track.rank}
        </span>
        <img
          className={`${coverSquareClass} size-12`}
          src={track.cover}
          alt=''
          width={48}
          height={48}
          loading='lazy'
          decoding='async'
        />
        <span className='grid min-w-0 gap-0.5'>
          <span className={`truncate ${siteCardName}`}>{track.title}</span>
          <span className={`truncate ${siteCardSummary}`}>
            {track.artist}
            {track.album ? ` · ${track.album}` : ''}
          </span>
        </span>
        <span className={siteWhen}>{track.plays} 次</span>
      </ItemLink>
    </li>
  )
}

function PlaylistCard({
  playlist,
  ssgMd
}: {
  playlist: MusicPlaylist
  ssgMd: boolean
}): ReactElement {
  if (ssgMd) {
    return (
      <li>
        {playlist.href ? <a href={playlist.href}>{playlist.title}</a> : playlist.title}
        {` — ${playlist.desc}（${playlist.trackCount} 首）`}
      </li>
    )
  }

  return (
    <li className='m-0 min-w-0'>
      <ItemLink
        href={playlist.href}
        className={`group grid h-full grid-cols-[5.5rem_1fr] gap-3 ${siteCardChrome} !p-2.5`}
      >
        <img
          className={`${coverSquareClass} size-[5.5rem]`}
          src={playlist.cover}
          alt=''
          width={88}
          height={88}
          loading='lazy'
          decoding='async'
        />
        <span className='grid min-w-0 content-center gap-1 py-0.5'>
          <span className={`line-clamp-2 ${siteCardName}`}>{playlist.title}</span>
          <span className={`line-clamp-2 ${siteCardSummary}`}>{playlist.desc}</span>
          <span className={siteWhen}>{playlist.trackCount} 首</span>
        </span>
      </ItemLink>
    </li>
  )
}

function MusicPage({ ssgMd }: { ssgMd: boolean }): ReactElement {
  const { title, intro, listening, playlists } = likesData.music
  return (
    <PageShell title={title} intro={intro} ssgMd={ssgMd}>
      {ssgMd ? null : (
        <p className='-mt-6 mb-0 font-[family-name:var(--rp-font-family-mono)] text-[0.78rem] font-medium tracking-[0.02em] text-[var(--rp-c-text-2)]'>
          {listening.period} · 更新于 {listening.updatedAt}
        </p>
      )}
      <BackLink />
      <section className={siteSection}>
        <h2 className={siteH2}>{listening.title}</h2>
        <ul className={ssgMd ? undefined : 'm-0 grid list-none gap-2 p-0'}>
          {listening.tracks.map(track => (
            <TrackRow key={track.rank} track={track} ssgMd={ssgMd} />
          ))}
        </ul>
      </section>
      <section className={siteSection}>
        <h2 className={siteH2}>歌单</h2>
        {ssgMd ? (
          <ul>
            {playlists.map(playlist => (
              <PlaylistCard key={playlist.title} playlist={playlist} ssgMd />
            ))}
          </ul>
        ) : (
          <ul className={gridPlaylistClass}>
            {playlists.map(playlist => (
              <PlaylistCard key={playlist.title} playlist={playlist} ssgMd={false} />
            ))}
          </ul>
        )}
      </section>
    </PageShell>
  )
}

function Hub({ ssgMd }: { ssgMd: boolean }): ReactElement {
  const { title, intro, categories } = likesData
  return (
    <PageShell title={title} intro={intro} ssgMd={ssgMd}>
      <section className={siteSection}>
        <h2 className={siteH2}>分类</h2>
        {ssgMd ? (
          <ul>
            {categories.map(category => (
              <li key={category.id}>
                <a href={category.href}>{category.title}</a>
                {` — ${category.desc}`}
              </li>
            ))}
          </ul>
        ) : (
          <ul className='mb-0 grid list-none grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-3 p-0'>
            {categories.map(category => (
              <li key={category.id} className='m-0 min-w-0'>
                <a
                  className={`group grid h-full gap-2 ${siteCardChrome}`}
                  href={category.href}
                  data-card=''
                >
                  <span className='flex items-baseline justify-between gap-3'>
                    <span className={siteCardName}>{category.title}</span>
                    <span className={siteWhen}>{category.countLabel}</span>
                  </span>
                  <span className={siteCardSummary}>{category.desc}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
      {ssgMd ? null : (
        <p className={`mt-8 ${sitePanelChrome} ${siteBody}`}>
          有听歌、没旅行：会维护常听榜；出门更偏向科技馆和展览，而不是景点打卡。数据在{' '}
          <code>static/data/likes.json</code>。
        </p>
      )}
    </PageShell>
  )
}

function CategoryPage({
  id,
  layout,
  ssgMd
}: {
  id: Exclude<LikesCategoryId, 'music'>
  layout: 'text' | 'poster' | 'wide'
  ssgMd: boolean
}): ReactElement {
  const shelf = shelfOf(id)
  return (
    <PageShell title={shelf.title} intro={shelf.intro} ssgMd={ssgMd}>
      <BackLink />
      <ShelfSections shelf={shelf} layout={layout} ssgMd={ssgMd} />
    </PageShell>
  )
}

const layoutOf: Record<Exclude<LikesCategoryId, 'music'>, 'text' | 'poster' | 'wide'> = {
  uses: 'text',
  reading: 'text',
  games: 'wide',
  visits: 'wide',
  watching: 'poster'
}

/** Interest hub: uses / music / games / watching / visits / reading. */
export function LikesPage({
  category = 'hub',
  ssgMd = Boolean(import.meta.env.SSG_MD)
}: {
  category?: 'hub' | LikesCategoryId
  ssgMd?: boolean
} = {}): ReactElement {
  if (category === 'hub') {
    return <Hub ssgMd={ssgMd} />
  }
  if (category === 'music') {
    return <MusicPage ssgMd={ssgMd} />
  }
  return <CategoryPage id={category} layout={layoutOf[category]} ssgMd={ssgMd} />
}
