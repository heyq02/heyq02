import type { Intro } from '@heyq02/profile'
import { absoluteHref, intro, introZh } from '@heyq02/profile'

import type { Locale } from './locale.ts'

export interface SiteContent extends Intro {
  ui: {
    skipToContent: string
    language: string
    english: string
    chinese: string
  }
}

const enUi = {
  skipToContent: 'Skip to content',
  language: 'Language',
  english: 'EN',
  chinese: '中文'
} as const

const zhUi = {
  skipToContent: '跳到正文',
  language: '语言',
  english: 'EN',
  chinese: '中文'
} as const

function profileContent(source: Intro, ui: SiteContent['ui']): SiteContent {
  return {
    ...source,
    names: [...source.names],
    sections: { ...source.sections },
    places: source.places.map(place => ({ ...place, href: absoluteHref(place.href) })),
    skills: source.skills.map(skill => ({ ...skill, href: absoluteHref(skill.href) })),
    ui
  }
}

const byLocale: Record<Locale, SiteContent> = {
  en: profileContent(intro, enUi),
  zh: profileContent(introZh, zhUi)
}

export function contentFor(locale: Locale): SiteContent {
  return byLocale[locale]
}
