import type { ReactElement } from 'react'

import {
  siteCardName,
  siteCardSummary,
  siteDisplay,
  siteH2,
  siteMeta,
  siteMediaLink,
  siteProgressFill,
  siteProgressTrack,
  siteRow,
  siteSection,
  siteTile,
  siteWhen
} from '../../lib/site-ui.ts'
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
      <p className={`-mt-rp-6 mb-0 ${siteMeta}`}>
        {listening.period} · 更新于 {listening.updatedAt}
      </p>
      <BackLink />

      <section className={siteSection}>
        <h2 className={siteH2}>本周最常听</h2>
        <FeaturedTrack track={featured} />
      </section>

      <section className={siteSection}>
        <h2 className={siteH2}>排行</h2>
        <ol className='gap-rp-2 m-0 grid list-none p-0'>
          {(rest.length > 0 ? rest : listening.tracks).map(track => (
            <li key={track.rank} className='m-0'>
              <RankRow track={track} maxPlays={maxPlays} />
            </li>
          ))}
        </ol>
      </section>

      <section className={siteSection}>
        <h2 className={siteH2}>歌单墙</h2>
        <ul className='gap-rp-3 pb-rp-2 m-0 flex list-none overflow-x-auto p-0'>
          {playlists.map(playlist => (
            <li key={playlist.title} className='m-0 w-[calc(var(--rp-radius-large)*7)] shrink-0'>
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
      className={`group gap-rp-4 p-rp-4 grid overflow-hidden sm:grid-cols-[10rem_1fr] ${siteTile}`}
    >
      <img
        className='rounded-rp-sm shadow-rp aspect-square w-full object-cover'
        src={track.cover}
        alt=''
        width={160}
        height={160}
      />
      <span className='gap-rp-2 grid content-center'>
        <span className={badgeClass}>
          #{track.rank} · {track.plays} 次
        </span>
        <span className={siteDisplay}>{track.title}</span>
        <span className={siteCardSummary}>
          {track.artist} · {track.album}
        </span>
        <span className={`mt-rp-1 h-1.5 max-w-sm ${siteProgressTrack}`}>
          <span className={`${siteProgressFill} w-[92%]`} />
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
      className={`group gap-rp-3 px-rp-2 py-rp-2 grid grid-cols-[2rem_3rem_minmax(0,1fr)_auto] items-center ${siteRow}`}
    >
      <span className='text-rp-muted text-center font-mono'>{track.rank}</span>
      <img
        className='rounded-rp-sm size-12 object-cover'
        src={track.cover}
        alt=''
        width={48}
        height={48}
        loading='lazy'
      />
      <span className='gap-rp-1 grid min-w-0'>
        <span className='gap-rp-2 flex min-w-0 items-baseline justify-between'>
          <span className={`truncate ${siteCardName}`}>{track.title}</span>
          <span className={siteWhen}>{track.plays}</span>
        </span>
        <span className={`truncate ${siteCardSummary}`}>{track.artist}</span>
        <span className={`h-1 ${siteProgressTrack}`}>
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
    <ItemLink href={playlist.href} className={siteMediaLink}>
      <img
        className='rounded-rp-sm shadow-rp aspect-square w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]'
        src={playlist.cover}
        alt=''
        loading='lazy'
      />
      <span className='gap-rp-1 grid'>
        <span className={`line-clamp-1 ${siteCardName}`}>{playlist.title}</span>
        <span className={`line-clamp-2 ${siteCardSummary}`}>{playlist.desc}</span>
        <span className={siteWhen}>{playlist.trackCount} 首</span>
      </span>
    </ItemLink>
  )
}
