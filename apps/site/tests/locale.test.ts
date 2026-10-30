/** @vitest-environment happy-dom */
import { afterEach, expect, it } from 'vite-plus/test'

import { contentFor } from '../src/i18n/content.ts'
import {
  DEFAULT_LOCALE,
  localeFromHash,
  localeHashValue,
  localeHtmlLang,
  parseLocaleFromHash,
  setLocaleHash
} from '../src/i18n/locale.ts'

afterEach(() => {
  globalThis.location.hash = ''
})

it('defaults to English and maps html lang', () => {
  expect(DEFAULT_LOCALE).toBe('en')
  expect(localeHtmlLang.en).toBe('en')
  expect(localeHtmlLang.zh).toBe('zh-CN')
  expect(localeFromHash('')).toBe('en')
  expect(localeFromHash('#')).toBe('en')
  expect(localeFromHash('#foo=bar')).toBe('en')
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
  expect(localeFromHash()).toBe('en')
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
  expect(zh.sections.experience).toBe('经历')
  expect(en.ui.skipToContent).toBe('Skip to content')
  expect(zh.ui.skipToContent).toBe('跳到正文')
  expect(zh.degree).toBe('学士')
  expect(zh.experiences[0]?.end).toBe('至今')
})
