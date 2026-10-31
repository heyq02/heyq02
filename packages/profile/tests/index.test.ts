import { expect, it } from 'vite-plus/test'

import {
  absoluteHref,
  formatCount,
  fullName,
  intro,
  places,
  profile,
  skills
} from '../src/index.ts'

it('rewrites root-relative hrefs and leaves absolute ones alone', () => {
  expect(absoluteHref('/wechat.jpg')).toBe(`${intro.site}/wechat.jpg`)
  expect(absoluteHref('https://github.com/heyq02')).toBe('https://github.com/heyq02')
  expect(absoluteHref('/x', 'https://example.com')).toBe('https://example.com/x')
})

it('maps places and skills through absoluteHref', () => {
  expect(places.some(place => place.href.startsWith(intro.site))).toBe(true)
  expect(skills.every(skill => skill.href.startsWith('http'))).toBe(true)
})

it('formats counts under and over one thousand', () => {
  expect(formatCount(0)).toBe('0')
  expect(formatCount(999)).toBe('999')
  expect(formatCount(1000)).toBe('1k')
  expect(formatCount(1500)).toBe('1.5k')
  expect(formatCount(4730)).toBe('4.7k')
})

it('builds the full name with an optional role suffix', () => {
  expect(fullName()).toBe(intro.name)
  expect(fullName(' · Engineer')).toBe(`${intro.name} · Engineer`)
})

it('exposes a terminal-oriented profile view', () => {
  expect(profile.name).toBe(intro.name)
  expect(profile.email).toBe(intro.contact.email)
  expect(profile.projects[0]).not.toHaveProperty('languageColor')
})
