import type { ReactElement } from 'react'

/** Dashed rule with a centered pill — DIYgod-style section jump. */
export function JumpRail({ label }: { label: string }): ReactElement {
  return (
    <div className='my-rp-12 relative'>
      <div className='border-rp-divider relative w-full border-t border-dashed' />
      <div className='bg-rp-bg border-rp-divider-light text-rp-xs text-rp-muted absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border px-3 py-1.5 tracking-widest uppercase shadow-sm'>
        <span className='leading-none'>{label}</span>
        <span className='leading-none' aria-hidden>
          ↓
        </span>
      </div>
    </div>
  )
}
