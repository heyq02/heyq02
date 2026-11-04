import { useState } from 'react'
import type { ReactElement } from 'react'

import { intro } from '../lib/intro.ts'
import { badgeClass, siteH1, siteHeaderRule } from '../lib/site-ui.ts'

interface ProfilePlayProps {
  tags: string[]
}

/** Hero avatar + kaomoji: poke to wobble and cycle moods. */
export default function ProfilePlay({ tags }: ProfilePlayProps): ReactElement {
  const faces = intro.moods
  const [mood, setMood] = useState(0)
  const [spinning, setSpinning] = useState(false)

  const poke = () => {
    setMood(index => (index + 1) % faces.length)
    setSpinning(true)
  }

  const face = faces[mood % faces.length]

  return (
    <header
      className={`grid grid-cols-1 items-center gap-x-5 ${siteHeaderRule} sm:grid-cols-[7rem_1fr]`}
    >
      <button
        type='button'
        className={`m-0 block cursor-pointer rounded-[var(--site-radius)] border-0 bg-transparent p-0 leading-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--site-brand)]${spinning ? ' profile-avatar-button--spin' : ''}`}
        onClick={poke}
        onAnimationEnd={() => {
          setSpinning(false)
        }}
        aria-label='戳一下头像'
        title='戳我'
      >
        <img
          className={`block size-28 rounded-[var(--site-radius)] border border-[var(--site-divider-light)] object-cover shadow-[var(--site-shadow-1)] transition-shadow duration-200 hover:shadow-[var(--site-shadow-1)]${spinning ? ' animate-avatar-wobble' : ''}`}
          src={intro.avatar}
          alt={intro.name}
          width={112}
          height={112}
          draggable={false}
        />
      </button>
      <div className='min-w-0'>
        <h1 className={siteH1}>{intro.name}</h1>
        <button
          type='button'
          className='mt-[0.45rem] inline-flex cursor-pointer rounded-[var(--site-radius-small)] border-0 bg-transparent px-[0.35rem] py-[0.15rem] font-[family-name:var(--site-mono)] text-[1.05rem] leading-[1.3] text-[var(--site-text-2)] transition-[color,background-color,transform] duration-200 hover:-translate-y-px hover:bg-[var(--site-bg-soft)] hover:text-[var(--site-brand)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-brand)]'
          onClick={poke}
          aria-label='换一个表情'
          title='点一下换个表情'
        >
          {face}
        </button>
        <p className='mt-[0.65rem] mb-0 flex flex-wrap gap-[0.4rem]'>
          {tags.map(tag => (
            <span key={tag} className={badgeClass}>
              {tag}
            </span>
          ))}
        </p>
      </div>
    </header>
  )
}
