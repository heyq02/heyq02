/** @vitest-environment happy-dom */
import { act, cleanup, render, screen } from '@testing-library/react'
import type * as Motion from 'motion/react'
import type { ReactNode } from 'react'
import type { SimpleIcon } from 'simple-icons'
import { afterEach, expect, it, vi } from 'vite-plus/test'

import * as brands from '../src/brands.ts'
import { BrandIcon } from '../src/components/BrandIcon.tsx'
import { Reveal } from '../src/components/Reveal.tsx'
import { SectionHeading } from '../src/components/SectionHeading.tsx'
import type * as Content from '../src/i18n/content.ts'
import { LocaleProvider } from '../src/i18n/LocaleContext.tsx'
import { Page } from '../src/layout.tsx'
import { Home, markAbbr } from '../src/pages/Home.tsx'
import { name } from '../src/site.ts'

function renderWithLocale(ui: ReactNode) {
  return render(<LocaleProvider>{ui}</LocaleProvider>)
}

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

const icon = {
  title: 'Vue.js',
  slug: 'vuedotjs',
  hex: '4FC08D',
  path: 'M0 0h24v24H0z'
} as SimpleIcon

it('renders brand icons with size and color variants', () => {
  const { rerender } = render(<BrandIcon icon={icon} />)
  expect(document.querySelector('svg')?.getAttribute('class')).toContain('size-3.5')

  rerender(<BrandIcon colored icon={icon} size='md' />)
  expect(document.querySelector('svg')?.getAttribute('fill')).toBe('#4FC08D')

  rerender(<BrandIcon colorOnHover icon={icon} size='md' />)
  const hover = document.querySelector('svg')
  expect(hover?.getAttribute('class')).toContain('skill-brand')
  expect(hover?.getAttribute('style')).toContain('--brand')
})

it('renders section headings and abbreviation marks', () => {
  render(<SectionHeading id='skills' title='Skills' />)
  expect(screen.getByRole('heading', { name: 'Skills' }).id).toBe('skills')
  expect(markAbbr('Rspack')).toBe('Rs')
})

it('renders Reveal and Page chrome', () => {
  const { rerender } = renderWithLocale(
    <Page kicker='PROFILE'>
      <Reveal delay={0.1}>
        <p>hello</p>
      </Reveal>
    </Page>
  )

  expect(screen.getByText('PROFILE')).toBeTruthy()
  expect(screen.getByText('hello')).toBeTruthy()
  expect(screen.getByRole('link', { name: '跳到正文' }).getAttribute('href')).toBe('#main')

  rerender(
    <LocaleProvider>
      <Page>
        <p>plain</p>
      </Page>
    </LocaleProvider>
  )
  expect(screen.queryByText('PROFILE')).toBeNull()
  expect(screen.getByText('plain')).toBeTruthy()
})

it('animates Reveal when motion is allowed', async () => {
  vi.doMock('motion/react', async () => {
    const actual = await vi.importActual<typeof Motion>('motion/react')
    return {
      ...actual,
      useReducedMotion: () => false
    }
  })
  vi.resetModules()
  const { Reveal: MotionReveal } = await import('../src/components/Reveal.tsx')
  render(
    <MotionReveal delay={0.05}>
      <p>rise</p>
    </MotionReveal>
  )
  expect(screen.getByText('rise')).toBeTruthy()
  vi.doUnmock('motion/react')
  vi.resetModules()
})

it('renders the home page profile sections', () => {
  renderWithLocale(<Home />)

  expect(screen.getByRole('heading', { level: 1, name })).toBeTruthy()
  expect(screen.getByRole('heading', { name: '经历' })).toBeTruthy()
  expect(screen.getByRole('heading', { name: '技能' })).toBeTruthy()
  expect(screen.getByRole('heading', { name: '开源' })).toBeTruthy()
  expect(screen.getByText('4.7k')).toBeTruthy()
})

it('types the name when motion is allowed', async () => {
  vi.doMock('motion/react', async () => {
    const actual = await vi.importActual<typeof Motion>('motion/react')
    return {
      ...actual,
      useReducedMotion: () => false
    }
  })
  vi.resetModules()
  vi.useFakeTimers()
  const { Home: AnimatedHome } = await import('../src/pages/Home.tsx')
  const { LocaleProvider: AnimatedLocaleProvider } = await import('../src/i18n/LocaleContext.tsx')
  render(
    <AnimatedLocaleProvider>
      <AnimatedHome />
    </AnimatedLocaleProvider>
  )

  await act(async () => {
    await vi.advanceTimersByTimeAsync(140)
  })
  expect(screen.getByRole('heading', { level: 1, name }).textContent).toBe('A')

  await act(async () => {
    await vi.advanceTimersByTimeAsync(140 * (name.length - 1))
  })
  expect(screen.getByRole('heading', { level: 1, name }).textContent).toBe(name)

  await act(async () => {
    await vi.advanceTimersByTimeAsync(2000 + 100)
  })
  expect(screen.getByRole('heading', { level: 1, name }).textContent.length).toBeLessThan(
    name.length
  )

  await act(async () => {
    await vi.advanceTimersByTimeAsync(100 * name.length + 140)
  })
  expect(screen.getByRole('heading', { level: 1, name }).textContent.length).toBeGreaterThan(0)

  vi.doUnmock('motion/react')
  vi.resetModules()
})

it('falls back when brand icons are missing', () => {
  const original = brands.brandIcon
  vi.spyOn(brands, 'brandIcon').mockImplementation(label =>
    label === 'Vue' || label === 'WeChat' ? undefined : original(label)
  )

  renderWithLocale(<Home />)
  expect(screen.getByText('Vu')).toBeTruthy()
  expect(screen.queryByLabelText(/WeChat/)).toBeNull()
})

it('renders skill tooltips without a summary', async () => {
  vi.doMock('../src/i18n/content.ts', async () => {
    const actual = await vi.importActual<typeof Content>('../src/i18n/content.ts')
    return {
      ...actual,
      contentFor: () => ({
        ...actual.contentFor('en'),
        skills: [{ name: 'Vue', href: 'https://vuejs.org/', summary: '' }]
      })
    }
  })
  vi.resetModules()
  const { Home: SummaryHome } = await import('../src/pages/Home.tsx')
  const { LocaleProvider: SummaryLocaleProvider } = await import('../src/i18n/LocaleContext.tsx')
  render(
    <SummaryLocaleProvider>
      <SummaryHome />
    </SummaryLocaleProvider>
  )
  expect(screen.getByLabelText('Vue')).toBeTruthy()
  vi.doUnmock('../src/i18n/content.ts')
  vi.resetModules()
})
