import type { ReactElement } from 'react'

/** Dashed rule with a centered pill — DIYgod-style section jump. */
export function JumpRail({ label }: { label: string }): ReactElement {
  return (
    <div className='relative my-[calc(var(--rp-radius-large)*2)]'>
      <div className='relative w-full border-t border-dashed border-[var(--rp-c-divider)]' />
      <div className='absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border border-[var(--rp-c-divider-light)] bg-[var(--rp-c-bg)] px-3 py-1.5 text-[0.75rem] tracking-widest text-[var(--rp-c-text-2)] uppercase shadow-[var(--rp-shadow-1)]'>
        <span className='leading-none'>{label}</span>
        <span className='leading-none' aria-hidden>
          ↓
        </span>
      </div>
    </div>
  )
}
