import { m, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

import { easeOutQuart, riseDuration } from '../motion.ts'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduce = useReducedMotion()

  return (
    <m.div
      animate={{ opacity: 1, y: 0 }}
      className={className}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      transition={{
        duration: reduce ? 0 : riseDuration(),
        delay: reduce ? 0 : delay,
        ease: easeOutQuart()
      }}
    >
      {children}
    </m.div>
  )
}
