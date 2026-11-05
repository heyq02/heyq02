import { siteBody, siteH1, siteMeta } from '@heyq02/rspress-theme-ui'
import { Badge } from '@rspress/core/theme'
import { useState } from 'react'
import type { ReactElement } from 'react'

import { intro } from '../lib/intro.ts'
import { HomeWeather } from './HomeWeather.tsx'
import { SocialIcons } from './SocialIcons.tsx'

interface ProfilePlayProps {
  tags: string[]
  /** Override for tests; defaults to Rspress SSG-MD env. */
  ssgMd?: boolean
}

/** Hero: copy left, large avatar right — layout inspired by diygod.cc. */
export function ProfilePlay({
  tags,
  ssgMd = Boolean(import.meta.env.SSG_MD)
}: ProfilePlayProps): ReactElement {
  const faces = intro.moods
  const [mood, setMood] = useState(0)
  const [spinning, setSpinning] = useState(false)

  if (ssgMd) {
    return (
      <>
        {`![${intro.name}](${intro.avatar})`}
        {`\n\n# ${intro.headline}\n\n${intro.kaomoji} · ${intro.badge} · ${intro.zodiac} · ${intro.home.label}\n\n`}
        {`${intro.bio}\n\n${intro.about}\n\n`}
        {tags.map(tag => `\`${tag}\``).join(' ')}
        {'\n'}
        {intro.places.map(place => `- [${place.label}](${place.href})`).join('\n')}
        {`\n- [Email](mailto:${intro.contact.email})\n`}
      </>
    )
  }

  const poke = () => {
    setMood(index => (index + 1) % faces.length)
    setSpinning(true)
  }

  const face = faces[mood % faces.length]

  return (
    <header className='hey-rise mt-[var(--rp-radius-large)] flex flex-col items-center md:mt-[calc(var(--rp-radius-small)*5)] md:flex-row md:items-start'>
      <div className='relative w-full min-w-0 md:w-1/2'>
        <h1 className={siteH1}>{intro.headline}</h1>
        <p className='font-display mt-[var(--rp-radius)] mb-0 text-[1.125rem] leading-snug font-bold text-[var(--rp-c-text-1)]'>
          {intro.bio}
        </p>
        <p className={`${siteBody} mt-[var(--rp-radius)] max-w-xl`}>{intro.about}</p>
        <div className='mt-[var(--rp-radius)] flex flex-wrap items-baseline gap-x-[var(--rp-radius)] gap-y-[var(--rp-radius-small)]'>
          <button
            type='button'
            className='inline-flex shrink-0 cursor-pointer rounded-[var(--rp-radius-small)] border-0 bg-transparent px-[calc(var(--rp-radius-small)/2)] py-[calc(var(--rp-radius-small)/2)] font-mono text-[1.125rem] leading-snug text-[var(--rp-c-text-2)] transition-[color,background-color,transform] duration-200 hover:-translate-y-px hover:bg-[var(--rp-c-bg-soft)] hover:text-[var(--rp-c-brand)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--rp-c-brand)]'
            onClick={poke}
            aria-label='换一个表情'
            title='换一个表情'
          >
            {face}
          </button>
          <span className={`shrink-0 ${siteMeta}`}>
            {intro.badge}、{intro.zodiac}
          </span>
          <HomeWeather home={intro.home} />
        </div>
        <div className='mt-[calc(var(--rp-radius-small)*1.5)] mb-0 flex flex-wrap items-center gap-[var(--rp-radius-small)]'>
          {tags.map(tag => (
            <Badge key={tag} text={tag} type='info' outline />
          ))}
          <SocialIcons className='ml-[calc(var(--rp-radius-small)/2)]' />
        </div>
      </div>

      <div className='relative mt-[calc(var(--rp-radius)*2)] flex w-full justify-center md:mt-0 md:w-1/2 md:translate-y-1 md:justify-end md:pl-[calc(var(--rp-radius)*2)]'>
        <button
          type='button'
          className={`m-0 block max-w-xs cursor-pointer border-0 bg-transparent p-0 leading-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--rp-c-brand)]${spinning ? ' profile-avatar-button--spin' : ''}`}
          onClick={poke}
          onAnimationEnd={() => {
            setSpinning(false)
          }}
          aria-label='戳一下头像'
          title='戳我'
        >
          <img
            className={`block aspect-square w-full max-w-[20rem] rounded-3xl border border-[var(--rp-c-divider-light)] object-cover shadow-[var(--rp-shadow-2)] transition-shadow duration-200 hover:shadow-[var(--rp-shadow-1)]${spinning ? ' animate-avatar-wobble' : ''}`}
            src={intro.avatar}
            alt={intro.name}
            width={320}
            height={320}
            draggable={false}
          />
        </button>
      </div>
    </header>
  )
}
