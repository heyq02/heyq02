import { siteFocusRing } from '@heyq02/rspress-theme-ui'
import type { ReactElement, ReactNode } from 'react'

import { intro } from '../lib/intro.ts'

const iconClass = 'block size-[1.05rem]'

function GitHubIcon(): ReactElement {
  return (
    <svg className={iconClass} viewBox='0 0 24 24' aria-hidden>
      <path
        fill='currentColor'
        d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
      />
    </svg>
  )
}

function XIcon(): ReactElement {
  return (
    <svg className={iconClass} viewBox='0 0 24 24' aria-hidden>
      <path
        fill='currentColor'
        d='M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z'
      />
    </svg>
  )
}

function BilibiliIcon(): ReactElement {
  return (
    <svg className={iconClass} viewBox='0 0 24 24' aria-hidden>
      <path
        fill='currentColor'
        d='M17.813 4.653h.854c1.51.054 2.765.578 3.805 1.574 1.004.994 1.524 2.249 1.564 3.76v7.36c-.04 1.54-.52 2.794-1.564 3.76-1.04.996-2.295 1.528-3.805 1.572h-13.34c-1.516-.046-2.774-.576-3.785-1.574C.554 20.14.036 18.886 0 17.372v-7.36c.036-1.508.554-2.763 1.573-3.76 1.03-.992 2.29-1.52 3.786-1.572h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906 1.25 1.25 0 0 1 .373-.9c.496-.485 1.04-.485 1.6 0L7.53 4.65h8.907l1.174-1.12c.547-.485 1.09-.485 1.6 0 .497.484.497 1.026 0 1.51L17.813 4.65zm.854 2.28H5.333c-.814.018-1.466.246-1.973.78-.51.53-.76 1.178-.78 1.948v6.84c.02.78.27 1.42.78 1.95.507.53 1.16.77 1.973.79h13.334c.8-.02 1.45-.26 1.95-.79.5-.53.75-1.17.77-1.95v-6.84c-.02-.77-.27-1.42-.77-1.95-.5-.53-1.15-.76-1.95-.78zM8 11.02c.56 0 1.04.22 1.4.64.37.43.56.93.56 1.51 0 .61-.19 1.12-.56 1.54-.36.43-.84.64-1.4.64-.55 0-1.04-.21-1.41-.64-.37-.42-.56-.93-.56-1.54 0-.58.19-1.08.56-1.51.37-.42.86-.64 1.41-.64zm8 0c.56 0 1.04.22 1.4.64.37.43.56.93.56 1.51 0 .61-.19 1.12-.56 1.54-.36.43-.84.64-1.4.64-.55 0-1.04-.21-1.41-.64-.37-.42-.56-.93-.56-1.54 0-.58.19-1.08.56-1.51.37-.42.86-.64 1.41-.64z'
      />
    </svg>
  )
}

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

const ICONS: Partial<Record<string, () => ReactElement>> = {
  GitHub: GitHubIcon,
  X: XIcon,
  Bilibili: BilibiliIcon
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
      className={`text-rp-muted hover:text-rp-brand inline-flex items-center justify-center no-underline transition-colors hover:no-underline ${siteFocusRing}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}

/** Compact brand icons for the hero tag row. */
export function SocialIcons({ className = '' }: { className?: string }): ReactElement {
  return (
    <span className={`gap-rp-3 inline-flex items-center ${className}`.trim()}>
      {intro.places.map(place => {
        const Icon = ICONS[place.label]
        if (!Icon) {
          return null
        }
        return (
          <SocialIconLink key={place.label} href={place.href} label={place.label} external>
            <Icon />
          </SocialIconLink>
        )
      })}
      <SocialIconLink href={`mailto:${intro.contact.email}`} label='Email'>
        <EmailIcon />
      </SocialIconLink>
    </span>
  )
}
