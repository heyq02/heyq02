import type { ReactElement } from 'react'

import { siteCardName, siteCardSummary, siteH2, siteSection, siteWhen } from '../../lib/site-ui.ts'
import { likesData } from '../likes-data.ts'
import type { MusicPlaylist, MusicTrack } from '../likes-data.ts'
import { BackLink, ItemLink, PageShell, badgeClass } from './shared.tsx'

/** Player-style page: featured #1, ranked bars, playlist cover wall. */
export function MusicPage({ ssgMd }: { ssgMd: boolean }): ReactElement {
  const { title, intro, listening, playlists } = likesData.music
  const featured = listening.tracks[0]
  const rest = listening.tracks.slice(1)
  const maxPlays = Math.max(...listening.tracks.map(track => track.plays), 1)

  if (ssgMd) {
    return (
      <PageShell title={title} intro={intro} ssgMd tone='likes-music'>
        <BackLink />
        <h2 className={siteH2}>{listening.title}</h2>
        <ul>
          {listening.tracks.map(track => (
            <li key={track.rank}>
              {track.href ? (
                <a href={track.href}>{`${track.rank}. ${track.title}`}</a>
              ) : (
                `${track.rank}. ${track.title}`
              )}
              {` — ${track.artist} · ${track.plays} 次`}
            </li>
          ))}
        </ul>
        <h2 className={siteH2}>歌单</h2>
        <ul>
          {playlists.map(playlist => (
            <li key={playlist.title}>
              {playlist.href ? <a href={playlist.href}>{playlist.title}</a> : playlist.title}
              {` — ${playlist.desc}（${playlist.trackCount} 首）`}
            </li>
          ))}
        </ul>
      </PageShell>
    )
  }

  return (
    <PageShell title={title} intro={intro} ssgMd={false} tone='likes-music'>
      <p className='-mt-6 mb-0 font-[family-name:var(--rp-font-family-mono)] text-[0.78rem] font-medium tracking-[0.02em] text-[var(--rp-c-text-2)]'>
        {listening.period} · 更新于 {listening.updatedAt}
      </p>
      <BackLink />

      <section className={siteSection}>
        <h2 className={siteH2}>本周最常听</h2>
        <FeaturedTrack track={featured} />
      </section>

      <section className={siteSection}>
        <h2 className={siteH2}>排行</h2>
        <ol className='m-0 grid list-none gap-2 p-0'>
          {(rest.length > 0 ? rest : listening.tracks).map(track => (
            <li key={track.rank} className='m-0'>
              <RankRow track={track} maxPlays={maxPlays} />
            </li>
          ))}
        </ol>
      </section>

      <section className={siteSection}>
        <h2 className={siteH2}>歌单墙</h2>
        <ul className='m-0 flex list-none gap-3 overflow-x-auto p-0 pb-2'>
          {playlists.map(playlist => (
            <li key={playlist.title} className='m-0 w-[11rem] shrink-0'>
              <PlaylistTile playlist={playlist} />
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  )
}

function FeaturedTrack({ track }: { track: MusicTrack }): ReactElement {
  return (
    <ItemLink
      href={track.href}
      className='group grid gap-4 overflow-hidden rounded-[var(--rp-radius-small)] border border-[var(--rp-c-divider-light)] bg-[var(--rp-c-bg-soft)] p-4 no-underline hover:border-[var(--rp-c-brand)] hover:!no-underline sm:grid-cols-[10rem_1fr]'
    >
      <img
        className='aspect-square w-full rounded-[calc(var(--rp-radius-small)-2px)] object-cover shadow-[var(--rp-shadow-1)]'
        src={track.cover}
        alt=''
        width={160}
        height={160}
      />
      <span className='grid content-center gap-2'>
        <span className={badgeClass}>
          #{track.rank} · {track.plays} 次
        </span>
        <span className='text-[clamp(1.35rem,3vw,1.75rem)] font-bold tracking-[-0.02em] text-[var(--rp-c-text-1)]'>
          {track.title}
        </span>
        <span className={siteCardSummary}>
          {track.artist} · {track.album}
        </span>
        <span className='mt-1 h-1.5 max-w-sm overflow-hidden rounded-full bg-[var(--rp-c-divider-light)]'>
          <span className='block h-full w-[92%] rounded-full bg-[var(--rp-c-brand)]' />
        </span>
      </span>
    </ItemLink>
  )
}

function RankRow({ track, maxPlays }: { track: MusicTrack; maxPlays: number }): ReactElement {
  const width = `${Math.max(12, Math.round((track.plays / maxPlays) * 100))}%`
  return (
    <ItemLink
      href={track.href}
      className='group grid grid-cols-[2rem_3rem_minmax(0,1fr)_auto] items-center gap-3 rounded-[var(--rp-radius-small)] border border-transparent px-2 py-2 no-underline hover:border-[var(--rp-c-divider-light)] hover:bg-[var(--rp-c-bg-soft)] hover:!no-underline'
    >
      <span className='text-center font-[family-name:var(--rp-font-family-mono)] text-[var(--rp-c-text-2)]'>
        {track.rank}
      </span>
      <img
        className='size-12 rounded-md object-cover'
        src={track.cover}
        alt=''
        width={48}
        height={48}
        loading='lazy'
      />
      <span className='grid min-w-0 gap-1'>
        <span className='flex min-w-0 items-baseline justify-between gap-2'>
          <span className={`truncate ${siteCardName}`}>{track.title}</span>
          <span className={siteWhen}>{track.plays}</span>
        </span>
        <span className={`truncate ${siteCardSummary}`}>{track.artist}</span>
        <span className='h-1 overflow-hidden rounded-full bg-[var(--rp-c-divider-light)]'>
          <span
            className='block h-full rounded-full bg-[color-mix(in_oklab,var(--rp-c-brand)_75%,transparent)]'
            style={{ width }}
          />
        </span>
      </span>
    </ItemLink>
  )
}

function PlaylistTile({ playlist }: { playlist: MusicPlaylist }): ReactElement {
  return (
    <ItemLink href={playlist.href} className='group grid gap-2 no-underline hover:!no-underline'>
      <img
        className='aspect-square w-full rounded-[var(--rp-radius-small)] object-cover shadow-[var(--rp-shadow-1)] transition-transform duration-200 group-hover:scale-[1.02]'
        src={playlist.cover}
        alt=''
        loading='lazy'
      />
      <span className='grid gap-0.5'>
        <span className={`line-clamp-1 ${siteCardName}`}>{playlist.title}</span>
        <span className={`line-clamp-2 ${siteCardSummary}`}>{playlist.desc}</span>
        <span className={siteWhen}>{playlist.trackCount} 首</span>
      </span>
    </ItemLink>
  )
}
