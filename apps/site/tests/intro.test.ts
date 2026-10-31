import { expect, it } from 'vite-plus/test'

import { formatCount, intro } from '../src/intro.ts'

it('loads the English intro SSOT', () => {
  expect(intro.name).toBe('Ari He｜阿瑞')
  expect(intro.title).toBe(intro.name)
  expect(intro.description.startsWith(`${intro.name}.`)).toBe(true)
  expect(intro.moods[0]).toBe(intro.kaomoji)
  expect(intro.contact.email).toContain('@')
})

it('formats counts under and over one thousand', () => {
  expect(formatCount(0)).toBe('0')
  expect(formatCount(999)).toBe('999')
  expect(formatCount(1000)).toBe('1k')
  expect(formatCount(1500)).toBe('1.5k')
  expect(formatCount(4730)).toBe('4.7k')
})
