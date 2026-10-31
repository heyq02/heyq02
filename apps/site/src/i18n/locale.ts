export type Locale = 'en' | 'zh'

export const localeHtmlLang: Record<Locale, string> = {
  en: 'en',
  zh: 'zh-CN'
}

/** Parse a URL hash into a locale. Supports `#lang=zh`, `#lang=en`, `#zh`, `#en`. */
export function parseLocaleFromHash(hash: string): Locale | null {
  const raw = hash.replace(/^#/, '').replace(/^\//, '').trim()
  if (!raw) {
    return null
  }

  if (raw.includes('=')) {
    const params = new URLSearchParams(raw)
    return normalizeLocale(params.get('lang'))
  }

  const [token = ''] = raw.split(/[&/?#]/)
  return normalizeLocale(token)
}

export function localeFromLanguage(language: string | null | undefined): Locale {
  const lang = language?.trim().toLowerCase() ?? ''
  if (lang === 'zh' || lang.startsWith('zh-')) {
    return 'zh'
  }
  return 'en'
}

export function localeFromHash(
  hash = globalThis.location.hash,
  language = globalThis.navigator.language
): Locale {
  return parseLocaleFromHash(hash) ?? localeFromLanguage(language)
}

export function localeHashValue(locale: Locale): string {
  return `lang=${locale}`
}

/** Write `#lang=en` / `#lang=zh` without adding a history entry when unchanged. */
export function setLocaleHash(locale: Locale): void {
  const next = `#${localeHashValue(locale)}`
  if (globalThis.location.hash === next) {
    return
  }
  globalThis.location.hash = next
}

function normalizeLocale(value: string | null | undefined): Locale | null {
  if (!value) {
    return null
  }

  const lang = value.trim().toLowerCase()
  if (!/^[a-z]{2,3}(?:-[a-z0-9]+)*$/.test(lang)) {
    return null
  }
  return localeFromLanguage(lang)
}
