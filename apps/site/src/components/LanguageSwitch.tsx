import type { Locale } from '../i18n/locale.ts'
import { useLocale } from '../i18n/LocaleContext.tsx'

const options: { locale: Locale; labelKey: 'english' | 'chinese' }[] = [
  { locale: 'en', labelKey: 'english' },
  { locale: 'zh', labelKey: 'chinese' }
]

export function LanguageSwitch() {
  const { locale, setLocale, content } = useLocale()

  return (
    <div
      aria-label={content.ui.language}
      className='text-muted absolute top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] z-50 flex items-center gap-2 text-sm font-medium md:top-[max(1.25rem,env(safe-area-inset-top))] md:right-[max(1.5rem,env(safe-area-inset-right))]'
      role='group'
    >
      {options.map((option, index) => {
        const active = locale === option.locale
        const label = content.ui[option.labelKey]

        return (
          <span className='contents' key={option.locale}>
            {index > 0 ? (
              <span aria-hidden='true' className='text-border'>
                /
              </span>
            ) : null}
            <button
              aria-current={active ? 'true' : undefined}
              aria-pressed={active}
              className={
                active ? 'text-title transition-colors' : 'hover:text-title transition-colors'
              }
              onClick={() => {
                setLocale(option.locale)
              }}
              type='button'
            >
              {label}
            </button>
          </span>
        )
      })}
    </div>
  )
}
