import { expect, it } from 'vite-plus/test'

import {
  brandNamesWithoutSlug,
  brandSlug,
  brandSlugForLabel,
  brandSlugs,
  matchBrandName
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

it('keeps slug and no-slug brand catalogs disjoint', () => {
  for (const name of brandNamesWithoutSlug) {
    expect(brandSlugs[name]).toBeUndefined()
  }
  expect(Object.keys(brandSlugs).length).toBeGreaterThan(0)
})
