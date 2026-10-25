import { expect, it } from 'vite-plus/test'

import { fullName } from '../src/index.ts'

it('exports the introduction', () => {
  expect(fullName()).toBe('Ari He')
})
