import { expect, it } from 'vite-plus/test'

import {
  absoluteHref,
  chinese,
  formatCount,
  fullName,
  intro,
  introZh,
  mergeIntro,
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

it('overlays Chinese copy without forking shared facts', () => {
  expect(introZh.bio).toBe(chinese.bio)
  expect(introZh.sections.experience).toBe('经历')
  expect(introZh.experiences[0]?.company).toBe('京东集团')
  expect(introZh.experiences[0]?.href).toBe(intro.experiences[0]?.href)
  expect(introZh.experiences[0]?.start).toBe(intro.experiences[0]?.start)
  expect(introZh.skills[0]?.name).toBe(intro.skills[0]?.name)
  expect(introZh.skills[0]?.summary).not.toBe(intro.skills[0]?.summary)
  expect(introZh.places[4]?.detail).toBe('扫码添加')
  expect(introZh.places[4]?.href).toBe('/wechat.jpg')
  expect(introZh.projects[0]?.stars).toBe(intro.projects[0]?.stars)
})

it('rejects a Chinese overlay that does not line up with English', () => {
  expect(() => mergeIntro(intro, { ...chinese, places: [] })).toThrow(
    /Chinese places \(0\) must match English/
  )
})
