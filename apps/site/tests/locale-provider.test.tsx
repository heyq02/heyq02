/** @vitest-environment happy-dom */
import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vite-plus/test'

import { LanguageSwitch } from '../src/components/LanguageSwitch.tsx'
import { LocaleProvider, useContent, useLocale } from '../src/i18n/LocaleContext.tsx'
import { Page } from '../src/layout.tsx'
import { Home } from '../src/pages/Home.tsx'
import { name, sections } from '../src/site.ts'

afterEach(() => {
  cleanup()
  globalThis.location.hash = ''
  document.documentElement.lang = 'en'
  document.title = ''
})

function LocaleProbe() {
  const { locale } = useLocale()
  const content = useContent()
  return (
    <p>
      {locale}:{content.sections.experience}
    </p>
  )
}

it('provides English content by default and switches via the control', () => {
  render(
    <LocaleProvider>
      <LanguageSwitch />
      <LocaleProbe />
    </LocaleProvider>
  )

  expect(screen.getByText('en:Experience')).toBeTruthy()
  expect(document.documentElement.lang).toBe('en')

  act(() => {
    screen.getByRole('button', { name: '中文' }).click()
  })

  expect(globalThis.location.hash).toBe('#lang=zh')
  expect(screen.getByText('zh:经历')).toBeTruthy()
  expect(document.documentElement.lang).toBe('zh-CN')
})

it('reads the initial locale from the hash', () => {
  globalThis.location.hash = '#lang=zh'
  render(
    <LocaleProvider>
      <LocaleProbe />
    </LocaleProvider>
  )
  expect(screen.getByText('zh:经历')).toBeTruthy()
})

it('updates when the hash changes', () => {
  render(
    <LocaleProvider>
      <LocaleProbe />
    </LocaleProvider>
  )
  expect(screen.getByText('en:Experience')).toBeTruthy()

  act(() => {
    globalThis.location.hash = '#lang=zh'
    globalThis.dispatchEvent(new Event('hashchange'))
  })

  expect(screen.getByText('zh:经历')).toBeTruthy()
})

it('throws outside LocaleProvider', () => {
  expect(() => render(<LocaleProbe />)).toThrow(/LocaleProvider/)
})

it('renders localized home chrome and switcher', () => {
  render(
    <LocaleProvider>
      <Home />
    </LocaleProvider>
  )

  expect(screen.getByRole('heading', { level: 1, name })).toBeTruthy()
  expect(screen.getByRole('heading', { name: sections.experience })).toBeTruthy()
  expect(screen.getByRole('button', { name: 'EN' })).toBeTruthy()
  expect(screen.getByRole('button', { name: '中文' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Skip to content' })).toBeTruthy()

  act(() => {
    screen.getByRole('button', { name: '中文' }).click()
  })

  expect(screen.getByRole('heading', { name: '经历' })).toBeTruthy()
  expect(screen.getByRole('link', { name: '跳到正文' })).toBeTruthy()
  expect(screen.getByText('学士')).toBeTruthy()
})

it('keeps Page usable under the provider without a kicker', () => {
  render(
    <LocaleProvider>
      <Page>
        <p>plain</p>
      </Page>
    </LocaleProvider>
  )
  expect(screen.getByText('plain')).toBeTruthy()
})
