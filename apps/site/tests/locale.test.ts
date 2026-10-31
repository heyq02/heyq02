/** @vitest-environment happy-dom */
import { afterEach, expect, it } from 'vite-plus/test'

import { contentFor } from '../src/i18n/content.ts'
import {
  localeFromHash,
  localeFromLanguage,
  localeHashValue,
  localeHtmlLang,
  parseLocaleFromHash,
  setLocaleHash
} from '../src/i18n/locale.ts'

afterEach(() => {
  globalThis.location.hash = ''
})

it('uses the browser language when the hash names no locale', () => {
  expect(localeHtmlLang.en).toBe('en')
  expect(localeHtmlLang.zh).toBe('zh-CN')
  expect(localeFromLanguage('zh-CN')).toBe('zh')
  expect(localeFromLanguage('zh-TW')).toBe('zh')
  expect(localeFromLanguage('en-US')).toBe('en')
  expect(localeFromLanguage('')).toBe('en')
  expect(localeFromHash('', 'zh-CN')).toBe('zh')
  expect(localeFromHash('#', 'en-US')).toBe('en')
  expect(localeFromHash('#foo=bar', 'zh-TW')).toBe('zh')
  expect(localeFromHash('#lang=en', 'zh-CN')).toBe('en')
  expect(localeFromHash('#lang=zh', 'en-US')).toBe('zh')
})

it('parses hash locale parameters', () => {
  expect(parseLocaleFromHash('#lang=zh')).toBe('zh')
  expect(parseLocaleFromHash('#lang=en')).toBe('en')
  expect(parseLocaleFromHash('#lang=zh-CN')).toBe('zh')
  expect(parseLocaleFromHash('#lang=zh-Hans')).toBe('zh')
  expect(parseLocaleFromHash('#lang=en-US')).toBe('en')
  expect(parseLocaleFromHash('#foo=1&lang=zh')).toBe('zh')
  expect(parseLocaleFromHash('#lang=')).toBeNull()
  expect(parseLocaleFromHash('#zh')).toBe('zh')
  expect(parseLocaleFromHash('#en')).toBe('en')
  expect(parseLocaleFromHash('#/zh')).toBe('zh')
  expect(parseLocaleFromHash('#unknown')).toBeNull()
  expect(localeFromHash()).toBe('zh')
  globalThis.location.hash = '#lang=zh'
  expect(localeFromHash()).toBe('zh')
})

it('writes lang hash values', () => {
  expect(localeHashValue('zh')).toBe('lang=zh')
  setLocaleHash('zh')
  expect(globalThis.location.hash).toBe('#lang=zh')
  setLocaleHash('zh')
  expect(globalThis.location.hash).toBe('#lang=zh')
  setLocaleHash('en')
  expect(globalThis.location.hash).toBe('#lang=en')
})

it('returns localized site content', () => {
  const en = contentFor('en')
  const zh = contentFor('zh')

  expect(en.sections.experience).toBe('Experience')
  expect(zh.sections.experience).toBe('Experience')
  expect(en.ui.skipToContent).toBe('Skip to content')
  expect(zh.ui.skipToContent).toBe('Skip to content')
  expect(zh.degree).toBe('Bachelor')
  expect(zh.experiences[0]?.end).toBe('Present')
})
