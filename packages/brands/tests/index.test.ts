import { expect, it } from 'vite-plus/test'

import {
  brandNamesWithoutSlug,
  brandSlug,
  brandSlugForLabel,
  brandSlugs,
  matchBrandName,
  skillIconsPicture
} from '../src/index.ts'

it('matches exact brand names and labeled prefixes', () => {
  expect(matchBrandName('Vue')).toBe('Vue')
  expect(matchBrandName('Vue · frontend')).toBe('Vue')
  expect(matchBrandName('Taro（多端）')).toBe('Taro')
  expect(matchBrandName('Unknown')).toBeUndefined()
})

it('resolves simple-icons slugs from names and labels', () => {
  expect(brandSlug('TypeScript')).toBe('typescript')
  expect(brandSlug('Missing')).toBeUndefined()
  expect(brandSlugForLabel('React · UI')).toBe('react')
  expect(brandSlugForLabel('Taro')).toBeUndefined()
  expect(brandSlugForLabel('Nope')).toBeUndefined()
})

it('builds the shared skills picture URL', () => {
  const picture = skillIconsPicture(['Vue', 'Taro', 'Docker'])
  expect(picture.alt).toBe('Vue, Docker')
  expect(picture.src).toContain('icons=vuedotjs,docker')
  expect(picture.src).toContain('perline=2')
  expect(picture.src).toContain('theme=light')
  expect(skillIconsPicture([]).src).toContain('perline=1')
})

it('keeps slug and no-slug brand catalogs disjoint', () => {
  for (const name of brandNamesWithoutSlug) {
    expect(brandSlugs[name]).toBeUndefined()
  }
  expect(Object.keys(brandSlugs).length).toBeGreaterThan(0)
})
