import { intro } from '@heyq02/shared'
import { useState } from 'react'
import type { ReactElement } from 'react'

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
    <header className='profile-hero'>
      <button
        type='button'
        className={`profile-avatar-button${spinning ? ' profile-avatar-button--spin' : ''}`}
        onClick={poke}
        onAnimationEnd={() => {
          setSpinning(false)
        }}
        aria-label='Poke the avatar'
        title='Poke me'
      >
        <img
          className='profile-avatar'
          src={intro.avatar}
          alt={intro.name}
          width={112}
          height={112}
          draggable={false}
        />
      </button>
      <div className='profile-hero-copy'>
        <h1>{intro.name}</h1>
        <button
          type='button'
          className='profile-kaomoji'
          onClick={poke}
          aria-label='Change mood'
          title='Click for another face'
        >
          {face}
        </button>
        <p className='profile-meta'>{tags}</p>
      </div>
    </header>
  )
}
