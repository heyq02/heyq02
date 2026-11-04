import { siteBody, siteH1, siteMeta, TextLink } from '@heyq02/rspress-theme-ui'
import { Badge } from '@rspress/core/theme'
import { useState } from 'react'
import type { ReactElement } from 'react'

import { intro } from '../lib/intro.ts'
import { HomeWeather } from './HomeWeather.tsx'

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
  const socials = intro.places.filter(place => place.label !== 'WeChat')

  if (ssgMd) {
    return (
      <>
        {`![${intro.name}](${intro.avatar})`}
        {`\n\n# ${intro.headline}\n\n${intro.kaomoji} · ${intro.badge} · ${intro.zodiac} · ${intro.home.label}\n\n`}
        {`${intro.bio}\n\n${intro.about}\n\n`}
        {tags.map(tag => `\`${tag}\``).join(' ')}
        {'\n'}
      </>
    )
  }

  const poke = () => {
    setMood(index => (index + 1) % faces.length)
    setSpinning(true)
  }

  const face = faces[mood % faces.length]

  return (
    <header className='hey-rise mt-rp-6 md:mt-rp-10 flex flex-col items-center md:flex-row md:items-start'>
      <div className='relative w-full min-w-0 md:w-1/2'>
        <h1 className={siteH1}>{intro.headline}</h1>
        <p className='text-rp-lg text-rp-text mt-rp-4 font-display mb-0 leading-snug font-bold'>
          {intro.bio}
        </p>
        <p className={`${siteBody} mt-rp-4 max-w-xl`}>{intro.about}</p>
        <div className='mt-rp-4 gap-x-rp-4 gap-y-rp-2 flex flex-wrap items-baseline'>
          <button
            type='button'
            className='rounded-rp-sm px-rp-1 py-rp-1 text-rp-lg text-rp-muted hover:bg-rp-soft hover:text-rp-brand focus-visible:outline-rp-brand inline-flex shrink-0 cursor-pointer border-0 bg-transparent font-mono leading-snug transition-[color,background-color,transform] duration-200 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2'
            onClick={poke}
            aria-label='换一个表情'
            title='点一下换个表情'
          >
            {face}
          </button>
          <span className={`shrink-0 ${siteMeta}`}>
            {intro.badge}、{intro.zodiac}
          </span>
          <HomeWeather home={intro.home} />
        </div>
        <p className='mt-rp-3 gap-rp-1 mb-0 flex flex-wrap'>
          {tags.map(tag => (
            <Badge key={tag} text={tag} type='info' outline />
          ))}
        </p>
        <p className='mt-rp-5 gap-x-rp-4 gap-y-rp-2 text-rp-sm mb-0 flex flex-wrap'>
          {socials.map(place => (
            <TextLink key={place.label} href={place.href}>
              {place.label}
            </TextLink>
          ))}
          <TextLink href={`mailto:${intro.contact.email}`}>Email</TextLink>
        </p>
      </div>

      <div className='mt-rp-8 md:pl-rp-8 relative flex w-full justify-center md:mt-0 md:w-1/2 md:translate-y-1 md:justify-end'>
        <button
          type='button'
          className={`m-0 block max-w-xs cursor-pointer border-0 bg-transparent p-0 leading-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-rp-brand${spinning ? ' profile-avatar-button--spin' : ''}`}
          onClick={poke}
          onAnimationEnd={() => {
            setSpinning(false)
          }}
          aria-label='戳一下头像'
          title='戳我'
        >
          <img
            className={`border-rp-divider-light shadow-rp-md block aspect-square w-full max-w-[20rem] rounded-3xl border object-cover transition-shadow duration-200 hover:shadow-rp${spinning ? ' animate-avatar-wobble' : ''}`}
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
