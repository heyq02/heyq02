import { expect, it } from 'vite-plus/test'

import { formatCount, intro, skillIconsPicture } from '../src/index.ts'

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

it('builds the shared skills picture URL from icon slugs', () => {
  const picture = skillIconsPicture([
    { name: 'Vue', icon: 'vuedotjs' },
    { name: 'Taro', icon: '' },
    { name: 'Docker', icon: 'docker' }
  ])
  expect(picture.alt).toBe('Vue, Docker')
  expect(picture.src).toContain('icons=vuedotjs,docker')
  expect(picture.src).toContain('perline=2')
  expect(picture.src).toContain('theme=light')
  expect(skillIconsPicture([]).src).toContain('perline=1')
})
