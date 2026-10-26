import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import type { ReactNode } from 'react'

import { MeteorsBackground } from './components/MeteorsBackground.tsx'
import { easeOutQuart } from './motion.ts'

export function Page({ children, kicker }: { children: ReactNode; kicker?: string }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion='user' transition={{ ease: easeOutQuart() }}>
        <div className='bg-background text-foreground relative min-h-dvh pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] font-sans'>
          <MeteorsBackground />
          <div className='max-w-page px-page-x py-page-y md:px-page-x-md xl:px-page-x-xl relative mx-auto w-full'>
            <a
              className='focus-visible:bg-card sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-[max(1rem,env(safe-area-inset-top))] focus-visible:left-[max(1rem,env(safe-area-inset-left))] focus-visible:z-50 focus-visible:inline-block focus-visible:rounded-full focus-visible:px-3 focus-visible:py-1.5 focus-visible:text-sm'
              href='#main'
            >
              Skip to content
            </a>
            {kicker ? (
              <p className='text-title mb-8 text-sm font-medium'>{kicker}</p>
            ) : null}
            <main className='scroll-mt-6' id='main' tabIndex={-1}>
              {children}
            </main>
          </div>
        </div>
      </MotionConfig>
    </LazyMotion>
  )
}
