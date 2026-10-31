import { useState } from 'react'
import type { ReactElement } from 'react'

import intro from '../../../static/data/intro.json' with { type: 'json' }

interface ProfilePlayProps {
  tags: ReactElement
}

/** Hero avatar + kaomoji: click to spin and cycle moods (OSS-blog personality beat). */
export function ProfilePlay({ tags }: ProfilePlayProps): ReactElement {
  const faces = intro.moods.length > 0 ? intro.moods : [intro.kaomoji]
  const [mood, setMood] = useState(0)
  const [spinning, setSpinning] = useState(false)

  if (import.meta.env.SSG_MD) {
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
          {faces[mood] ?? intro.kaomoji}
        </button>
        <p className='profile-meta'>{tags}</p>
      </div>
    </header>
  )
}
