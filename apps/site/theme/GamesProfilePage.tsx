import {
  PageShell,
  SoftBadge,
  siteBody,
  siteCardChrome,
  siteCardName,
  siteCardSummary,
  siteFocusRing,
  siteMeta,
  siteWhen
} from '@heyq02/rspress-theme-ui'
import type { ReactElement } from 'react'

import { gamesData } from './games-data.ts'
import type { GameProfile } from './games-data.ts'

/** Dedicated /games/ page — player cards with peak rank + game ID. */
export function GamesProfilePage({
  ssgMd = Boolean(import.meta.env.SSG_MD)
}: {
  ssgMd?: boolean
} = {}): ReactElement {
  const { title, intro, tip, profiles } = gamesData

  if (ssgMd) {
    return (
      <PageShell title={title} intro={intro} ssgMd>
        <ul>
          {profiles.map(profile => (
            <li key={profile.id}>
              {profile.href ? <a href={profile.href}>{profile.name}</a> : profile.name}
              {` — ${profile.peakRank} · ID ${profile.gameId}`}
              {profile.server ? ` · ${profile.server}` : ''}
              {profile.note ? ` — ${profile.note}` : ''}
            </li>
          ))}
        </ul>
      </PageShell>
    )
  }

  return (
    <PageShell title={title} intro={intro} tip={tip} tone='games'>
      <div className='gap-rp-4 mt-rp-8 grid'>
        {profiles.map(profile => (
          <GameCard key={profile.id} profile={profile} />
        ))}
      </div>
    </PageShell>
  )
}

function GameCard({ profile }: { profile: GameProfile }): ReactElement {
  const body = (
    <span className='gap-rp-4 grid sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-stretch'>
      <span className='relative aspect-[16/10] overflow-hidden rounded-xl sm:aspect-auto sm:min-h-[8.5rem]'>
        {profile.cover ? (
          <img
            className='size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]'
            src={profile.cover}
            alt=''
            loading='lazy'
          />
        ) : (
          <span className='bg-rp-soft text-rp-muted text-rp-sm flex size-full items-center justify-center font-mono'>
            {profile.platform}
          </span>
        )}
      </span>

      <span className='gap-rp-3 grid min-w-0 content-center'>
        <span className='gap-rp-2 flex flex-wrap items-baseline justify-between'>
          <span className={siteCardName}>{profile.name}</span>
          <span className={siteWhen}>{profile.platform}</span>
        </span>

        <span className='gap-x-rp-6 gap-y-rp-3 grid grid-cols-2 sm:grid-cols-3'>
          <Stat label='最高段位' value={profile.peakRank} emphasize />
          <Stat label='游戏 ID' value={profile.gameId} mono />
          {profile.server ? <Stat label='区服' value={profile.server} /> : null}
        </span>

        {profile.peakDetail ? (
          <span className={`${siteMeta} m-0`}>{profile.peakDetail}</span>
        ) : null}

        {profile.roles && profile.roles.length > 0 ? (
          <span className='gap-rp-1 flex flex-wrap'>
            {profile.roles.map(role => (
              <SoftBadge key={role}>{role}</SoftBadge>
            ))}
          </span>
        ) : null}

        {profile.note ? <span className={`m-0 ${siteCardSummary}`}>{profile.note}</span> : null}

        {profile.publisher ? (
          <span className={`${siteBody} text-rp-sm m-0`}>{profile.publisher}</span>
        ) : null}
      </span>
    </span>
  )

  if (!profile.href) {
    return <div className={siteCardChrome}>{body}</div>
  }

  return (
    <a
      href={profile.href}
      target='_blank'
      rel='noopener noreferrer'
      className={`group block ${siteCardChrome} ${siteFocusRing}`}
      data-card=''
    >
      {body}
    </a>
  )
}

function Stat({
  label,
  value,
  emphasize = false,
  mono = false
}: {
  label: string
  value: string
  emphasize?: boolean
  mono?: boolean
}): ReactElement {
  return (
    <span className='gap-rp-1 grid min-w-0'>
      <span className={`tracking-[0.12em] uppercase ${siteMeta}`}>{label}</span>
      <span
        className={[
          'm-0 truncate text-rp-md leading-snug text-rp-text',
          emphasize ? 'font-display font-bold text-rp-lg' : 'font-semibold',
          mono ? 'font-mono' : ''
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {value}
      </span>
    </span>
  )
}
