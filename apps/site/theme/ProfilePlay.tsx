import { siteBody, siteH1, siteHeaderRule, siteMeta, TextLink } from '@heyq02/rspress-theme-ui'
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

const socialOrder = ['GitHub', 'X', 'Bilibili'] as const

/** Hero avatar + greeting; second row is emoji · badge/zodiac · home weather. */
export function ProfilePlay({
  tags,
  ssgMd = Boolean(import.meta.env.SSG_MD)
}: ProfilePlayProps): ReactElement {
  const faces = intro.moods
  const [mood, setMood] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const lead = intro.bio.split(/\n\n/)[0] ?? intro.bio

  if (ssgMd) {
    return (
      <>
        {`![${intro.name}](${intro.avatar})`}
        {`\n\n# ${intro.headline}\n\n${intro.kaomoji} · ${intro.badge} · ${intro.zodiac} · ${intro.home.label}\n\n`}
        {`${lead}\n\n`}
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
  const socials = socialOrder
    .map(label => intro.places.find(place => place.label === label))
    .filter((place): place is (typeof intro.places)[number] => Boolean(place))

  return (
    <header
      className={`gap-x-rp-6 gap-y-rp-5 hey-rise grid grid-cols-1 items-center ${siteHeaderRule} sm:grid-cols-[8.5rem_1fr]`}
    >
      <button
        type='button'
        className={`rounded-rp m-0 block cursor-pointer border-0 bg-transparent p-0 leading-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-rp-brand${spinning ? ' profile-avatar-button--spin' : ''}`}
        onClick={poke}
        onAnimationEnd={() => {
          setSpinning(false)
        }}
        aria-label='戳一下头像'
        title='戳我'
      >
        <img
          className={`rounded-rp border-rp-divider-light shadow-rp-md block size-32 border object-cover transition-shadow duration-200 hover:shadow-rp${spinning ? ' animate-avatar-wobble' : ''}`}
          src={intro.avatar}
          alt={intro.name}
          width={128}
          height={128}
          draggable={false}
        />
      </button>
      <div className='min-w-0'>
        <p className='text-rp-brand font-display mb-rp-2 text-rp-sm m-0 tracking-wide'>
          {intro.name} · 无限进步
        </p>
        <h1 className={siteH1}>{intro.headline}</h1>
        <div className='mt-rp-3 gap-x-rp-4 gap-y-rp-2 flex flex-wrap items-baseline'>
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
        <p className={`${siteBody} mt-rp-4 max-w-2xl`}>{lead}</p>
        <p className='mt-rp-3 gap-rp-1 mb-0 flex flex-wrap'>
          {tags.map(tag => (
            <Badge key={tag} text={tag} type='info' outline />
          ))}
        </p>
        <p className='mt-rp-4 gap-x-rp-4 gap-y-rp-2 text-rp-sm mb-0 flex flex-wrap'>
          {socials.map(place => (
            <TextLink key={place.label} href={place.href} className='text-rp-link'>
              {place.label}
            </TextLink>
          ))}
          <TextLink href={`mailto:${intro.contact.email}`} className='text-rp-link'>
            邮件
          </TextLink>
          <TextLink href='/likes/' className='text-rp-brand' external={false}>
            兴趣 →
          </TextLink>
          <TextLink href='/blog/' className='text-rp-brand' external={false}>
            博客 →
          </TextLink>
        </p>
      </div>
    </header>
  )
}
