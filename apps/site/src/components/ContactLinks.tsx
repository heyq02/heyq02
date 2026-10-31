import { brandIcon } from '../brands.ts'
import { useContent } from '../i18n/LocaleContext.tsx'
import { BrandIcon } from './BrandIcon.tsx'

export function ContactLinks() {
  const { places } = useContent()

  return (
    <ul className='absolute top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] z-50 flex items-center gap-3 md:top-[max(1.25rem,env(safe-area-inset-top))] md:right-[max(1.5rem,env(safe-area-inset-right))]'>
      {places.map(place => {
        const icon = brandIcon(place.label)
        if (!icon) {
          return null
        }

        return (
          <li key={place.label}>
            <a
              aria-label={`${place.label} ${place.detail}`}
              className='inline-flex size-6 items-center justify-center transition-opacity hover:opacity-60'
              href={place.href}
              rel='noreferrer'
              target='_blank'
              title={place.detail}
            >
              <BrandIcon colored icon={icon} size='md' />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
