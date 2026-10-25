import { LazyMotion, MotionConfig, domAnimation, m, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

import { MeteorsBackground } from './components/MeteorsBackground.tsx'
import { easeOutQuart, hoverDuration } from './motion.ts'
import { name, nav } from './site.ts'

export type SitePage = 'home' | 'blog'

export function Page({
  page,
  children,
  kicker
}: {
  page: SitePage
  children: ReactNode
  kicker?: string
}) {
  const reduce = useReducedMotion()

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
            <div className='min-h-nav mb-8 flex items-center justify-between'>
              {kicker ? (
                <p className='text-title text-sm font-medium'>{kicker}</p>
              ) : (
                <a
                  className='text-title hover:text-accent-text text-sm font-medium transition-colors'
                  href='/'
                >
                  {name}
                </a>
              )}
              <m.nav
                animate={{ opacity: 1 }}
                aria-label='Site'
                className='flex shrink-0 gap-6 text-sm'
                initial={reduce ? false : { opacity: 0 }}
                transition={{ duration: reduce ? 0 : hoverDuration() }}
              >
                {nav.map(link => {
                  const current = page === link.id
                  return (
                    <a
                      aria-current={current ? 'page' : undefined}
                      className={
                        current
                          ? 'text-accent-text decoration-accent-text inline-flex h-6 items-center underline underline-offset-8'
                          : 'text-muted hover:text-accent-text inline-flex h-6 items-center transition-colors'
                      }
                      href={link.href}
                      key={link.id}
                    >
                      {link.label}
                    </a>
                  )
                })}
              </m.nav>
            </div>
            <main className='scroll-mt-6' id='main' tabIndex={-1}>
              {children}
            </main>
          </div>
        </div>
      </MotionConfig>
    </LazyMotion>
  )
}
