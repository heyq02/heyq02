import type { Place } from '@heyq02/rspress-site-content'
import type { ReactElement, ReactNode } from 'react'
import type { SimpleIcon } from 'simple-icons'
import { siBilibili, siGithub, siX } from 'simple-icons'

import { siteFocusRing } from '../foundation/tokens.ts'

const iconClass = 'block size-4'

/** Brand place label → Simple Icons entry. */
const PLACE_ICONS: Partial<Record<string, SimpleIcon>> = {
  GitHub: siGithub,
  X: siX,
  Bilibili: siBilibili
}

function BrandIcon({ icon }: { icon: SimpleIcon }): ReactElement {
  return (
    <svg className={iconClass} viewBox='0 0 24 24' role='img' aria-hidden>
      <path fill='currentColor' d={icon.path} />
    </svg>
  )
}

/** Mailto is not a brand — Simple Icons has no generic email glyph. */
function EmailIcon(): ReactElement {
  return (
    <svg className={iconClass} viewBox='0 0 24 24' aria-hidden>
      <path
        fill='currentColor'
        d='M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4-8 5L4 8V6l8 5 8-5z'
      />
    </svg>
  )
}

function SocialIconLink({
  href,
  label,
  children,
  external
}: {
  href: string
  label: string
  children: ReactNode
  external?: boolean
}): ReactElement {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center text-[var(--rp-c-text-2)] no-underline transition-[color,transform] duration-200 hover:-translate-y-px hover:text-[var(--rp-c-brand)] hover:no-underline ${siteFocusRing}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}

export interface SocialIconsProps {
  places: Place[]
  email: string
  className?: string
}

/** Compact brand icons for the hero tag row (paths from Simple Icons). */
export function SocialIcons({ places, email, className = '' }: SocialIconsProps): ReactElement {
  return (
    <span className={`inline-flex items-center gap-[var(--hey-space-md)] ${className}`.trim()}>
      {places.map(place => {
        const icon = PLACE_ICONS[place.label]
        if (!icon) {
          return null
        }
        return (
          <SocialIconLink key={place.label} href={place.href} label={place.label} external>
            <BrandIcon icon={icon} />
          </SocialIconLink>
        )
      })}
      <SocialIconLink href={`mailto:${email}`} label='Email'>
        <EmailIcon />
      </SocialIconLink>
    </span>
  )
}
