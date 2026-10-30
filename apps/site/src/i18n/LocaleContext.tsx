import { createContext, useContext, useEffect, useEffectEvent, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { contentFor } from './content.ts'
import type { SiteContent } from './content.ts'
import { localeFromHash, localeHtmlLang, setLocaleHash } from './locale.ts'
import type { Locale } from './locale.ts'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  content: SiteContent
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function applyDocumentLocale(locale: Locale, content: SiteContent) {
  document.documentElement.lang = localeHtmlLang[locale]
  document.title = content.title
  document.querySelector('meta[name="description"]')?.setAttribute('content', content.description)
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => localeFromHash())
  const content = contentFor(locale)

  const syncFromHash = useEffectEvent(() => {
    setLocaleState(localeFromHash())
  })

  useEffect(() => {
    const onHashChange = () => {
      syncFromHash()
    }
    globalThis.addEventListener('hashchange', onHashChange)
    return () => {
      globalThis.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  useEffect(() => {
    applyDocumentLocale(locale, content)
  }, [content, locale])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      content,
      setLocale(next) {
        setLocaleState(next)
        setLocaleHash(next)
      }
    }),
    [content, locale]
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext)
  if (!value) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return value
}

export function useContent(): SiteContent {
  return useLocale().content
}
