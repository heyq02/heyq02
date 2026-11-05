import type { Intro } from '@heyq02/rspress-site-content'
import { Badge } from '@rspress/core/theme'
import { useCallback, useState } from 'react'
import type { AnimationEvent, ReactElement } from 'react'

import { siteBody, siteControlPad, siteFocusRing, siteH1, siteMeta } from '../foundation/tokens.ts'
import { HomeWeather } from '../widgets/HomeWeather.tsx'
import { SocialIcons } from '../widgets/SocialIcons.tsx'

export interface ProfileHeroProps {
  intro: Intro
  /** Override for tests; defaults to Rspress SSG-MD env. */
  ssgMd?: boolean
}

/** Hero: copy left, large avatar right — layout inspired by diygod.cc. */
export function ProfileHero({
  intro,
  ssgMd = Boolean(import.meta.env.SSG_MD)
}: ProfileHeroProps): ReactElement {
  const faces = intro.moods
  const [mood, setMood] = useState(0)
  const [spinning, setSpinning] = useState(false)

  const poke = useCallback(() => {
    setMood(index => (index + 1) % faces.length)
    setSpinning(true)
  }, [faces.length])

  const stopSpin = useCallback((_event: AnimationEvent<HTMLImageElement>) => {
    setSpinning(false)
  }, [])

  if (ssgMd) {
    return (
      <>
        {`![${intro.name}](${intro.avatar})`}
        {`\n\n# ${intro.headline}\n\n${intro.kaomoji} · ${intro.badge} · ${intro.zodiac} · ${intro.home.label}\n\n`}
        {`${intro.bio}\n\n${intro.about}\n\n`}
        {intro.tags.map(tag => `\`${tag}\``).join(' ')}
        {'\n'}
        {intro.places.map(place => `- [${place.label}](${place.href})`).join('\n')}
        {`\n- [Email](mailto:${intro.contact.email})\n`}
      </>
    )
  }

  const face = faces[mood % faces.length]

  return (
    <header className='hey-rise mt-[var(--hey-space-3xl)] flex flex-col items-center gap-[var(--hey-space-2xl)] md:flex-row md:items-start md:gap-[var(--hey-space-xl)]'>
      <div className='relative w-full min-w-0 flex-1'>
        <h1 className={siteH1}>{intro.headline}</h1>
        <p className='font-display mt-[var(--hey-space-lg)] mb-0 text-[1.125rem] leading-snug font-bold text-[var(--rp-c-text-1)]'>
          {intro.bio}
        </p>
        <p className={`${siteBody} mt-[var(--hey-space-lg)] max-w-prose`}>{intro.about}</p>
        <div className='mt-[var(--hey-space-lg)] flex flex-wrap items-baseline gap-x-[var(--hey-space-lg)] gap-y-[var(--hey-space-sm)]'>
          <button
            type='button'
            className={`inline-flex shrink-0 cursor-pointer rounded-[var(--rp-radius-small)] border-0 bg-transparent ${siteControlPad} font-mono text-[1.125rem] leading-snug text-[var(--rp-c-text-2)] transition-[color,background-color,transform] duration-200 hover:-translate-y-px hover:bg-[var(--rp-c-bg-soft)] hover:text-[var(--rp-c-brand)] active:scale-95 ${siteFocusRing}`}
            onClick={poke}
            aria-label='换一个表情'
            title='换一个表情'
            aria-describedby='profile-mood-live'
          >
            <span key={mood} className='hey-mood-pop inline-block' aria-hidden>
              {face}
            </span>
          </button>
          <span id='profile-mood-live' className='sr-only' aria-live='polite'>
            当前表情 {face}
          </span>
          <span className={`shrink-0 ${siteMeta}`}>
            {intro.badge}、{intro.zodiac}
          </span>
          <HomeWeather home={intro.home} />
        </div>
        <div className='mt-[var(--hey-space-md)] mb-0 flex flex-wrap items-center gap-[var(--hey-space-sm)]'>
          {intro.tags.map(tag => (
            <Badge key={tag} text={tag} type='info' outline />
          ))}
          <SocialIcons
            className='ml-[var(--hey-space-2xs)]'
            places={intro.places}
            email={intro.contact.email}
          />
        </div>
      </div>

      {/* DeepSeek-inspired「深度思考」avatar frame — breathe + ripple. */}
      <div className='hey-avatar-stage hey-avatar-think relative w-[min(100%,calc(var(--hey-avatar-size)+1.25rem))] shrink-0 md:pt-1'>
        <div className='hey-avatar-think__frame relative mx-auto aspect-square w-[88%]'>
          <div className='hey-avatar-think__ripples' aria-hidden>
            <span className='hey-avatar-think__ripple' />
            <span className='hey-avatar-think__ripple' />
            <span className='hey-avatar-think__ripple' />
          </div>
          <div className='hey-avatar-think__pulse relative'>
            <img
              className={`hey-avatar-think__photo block aspect-square w-full rounded-full object-cover${spinning ? ' animate-avatar-wobble' : ''}`}
              src={intro.avatar}
              alt={intro.name}
              width={216}
              height={216}
              draggable={false}
              onAnimationEnd={stopSpin}
            />
            <span className='hey-avatar-think__badge'>
              <svg
                className='hey-avatar-think__atom'
                viewBox='0 0 16 16'
                width={20}
                height={20}
                aria-hidden
              >
                <circle cx='8' cy='8' r='1.5' fill='currentColor' />
                <ellipse
                  cx='8'
                  cy='8'
                  rx='6.4'
                  ry='2.45'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.25'
                />
                <ellipse
                  cx='8'
                  cy='8'
                  rx='6.4'
                  ry='2.45'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.25'
                  transform='rotate(60 8 8)'
                />
                <ellipse
                  cx='8'
                  cy='8'
                  rx='6.4'
                  ry='2.45'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.25'
                  transform='rotate(120 8 8)'
                />
              </svg>
              深度思考
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
