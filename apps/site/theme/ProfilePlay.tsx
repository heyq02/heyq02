import { useState } from 'react'
import type { ReactElement } from 'react'

import { intro } from '../lib/intro.ts'
import { siteH1, siteHeaderRule } from '../lib/site-ui.ts'

interface ProfilePlayProps {
  tags: ReactElement
  /** Override for tests; defaults to Rspress SSG-MD env. */
  ssgMd?: boolean
}

/** Hero avatar + kaomoji: poke to wobble and cycle moods. */
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
        {`\n\n# ${intro.name}\n\n${intro.kaomoji}\n\n`}
        {tags}
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
    <header
      className={`gap-x-rp-5 grid grid-cols-1 items-center ${siteHeaderRule} sm:grid-cols-[7rem_1fr]`}
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
          className={`rounded-rp border-rp-divider-light shadow-rp-md block size-28 border object-cover transition-shadow duration-200 hover:shadow-rp${spinning ? ' animate-avatar-wobble' : ''}`}
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
          className='mt-rp-2 rounded-rp-sm px-rp-1 py-rp-1 text-rp-lg text-rp-muted hover:bg-rp-soft hover:text-rp-brand focus-visible:outline-rp-brand inline-flex cursor-pointer border-0 bg-transparent font-mono leading-snug transition-[color,background-color,transform] duration-200 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2'
          onClick={poke}
          aria-label='换一个表情'
          title='点一下换个表情'
        >
          {face}
        </button>
        <p className='mt-rp-3 gap-rp-1 mb-0 flex flex-wrap'>{tags}</p>
      </div>
    </header>
  )
}
