/** @vitest-environment happy-dom */
import { expect, it } from 'vite-plus/test'

import { brandIcon } from '../src/brands.ts'

it('resolves simple-icons for known brand labels', () => {
  expect(brandIcon('Vue')?.slug).toBe('vuedotjs')
  expect(brandIcon('TypeScript')?.slug).toBe('typescript')
  expect(brandIcon('React · UI')?.slug).toBe('react')
})

it('returns undefined for unknown or slugless brands', () => {
  expect(brandIcon('Unknown')).toBeUndefined()
  expect(brandIcon('Taro')).toBeUndefined()
})
