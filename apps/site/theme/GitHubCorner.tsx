import type { ReactElement } from 'react'

const REPO = 'https://github.com/heyq02/heyq02'

/** Ribbon corner like YunYouJun / classic OSS personal sites. */
export function GitHubCorner(): ReactElement | null {
  if (import.meta.env.SSG_MD) {
    return null
  }

  return (
    <a
      className='github-corner'
      href={REPO}
      target='_blank'
      rel='noopener noreferrer'
      aria-label='View source on GitHub'
    >
      <svg width='80' height='80' viewBox='0 0 250 250' aria-hidden='true'>
        <path d='M0 0l115 115h15l12 27L250 250V0z' />
        <path
          className='github-corner__arm'
          d='M128 109c-15-9-9-19-9-19 3-7 2-11 2-11-1-7 3-2 3-2 4 5 2 11 2 11-3 10 5 15 9 16'
          fill='currentColor'
        />
        <path
          fill='currentColor'
          d='M115 115s4 2 5 0l14-14c3-3 6-4 8-3-8-11-15-25 2-41 5-5 10-7 16-7 1-2 3-7 12-11 0 0 5 3 8 16 4 2 8 5 12 9s7 8 9 12c14 3 17 7 17 7-4 8-9 11-12 11 0 6-2 11-7 16-16 16-30 10-41 2 1 3 1 7-1 10z'
        />
      </svg>
    </a>
  )
}
