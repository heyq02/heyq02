import type { ReactElement } from 'react'

import { siteFocusRing } from '../foundation/tokens.ts'

/** Dashed rule with a centered pill — links to a section when `targetId` is set. */
export function JumpRail({
  label,
  targetId
}: {
  label: string
  /** Element id to scroll into view (native hash navigation). */
  targetId?: string
}): ReactElement {
  const pill = (
    <>
      <span className='leading-none'>{label}</span>
      <span className='hey-arrow-bob leading-none' aria-hidden>
        ↓
      </span>
    </>
  )

  const chrome =
    'absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border border-[var(--rp-c-divider-light)] bg-[var(--rp-c-bg)] px-3 py-1.5 text-[0.75rem] tracking-widest text-[var(--rp-c-text-2)] uppercase shadow-[var(--rp-shadow-1)]'

  return (
    <div className='relative my-[calc(var(--rp-radius-large)*2)]'>
      <div
        className='relative w-full border-t border-dashed border-[var(--rp-c-divider)]'
        aria-hidden
      />
      {targetId ? (
        <a
          href={`#${targetId}`}
          className={`${chrome} no-underline transition-[color,border-color,box-shadow,transform] duration-200 hover:-translate-x-1/2 hover:-translate-y-[calc(50%+2px)] hover:border-[var(--rp-c-brand)] hover:text-[var(--rp-c-brand)] hover:no-underline hover:shadow-[var(--rp-shadow-2)] ${siteFocusRing}`}
          aria-label={`跳到${label}`}
        >
          {pill}
        </a>
      ) : (
        <div className={chrome}>{pill}</div>
      )}
    </div>
  )
}
