import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { intro, skillIconsPicture } from '../src/index.ts'

it('shared e2e: intro matches on-disk SSOT and skills picture shape', async () => {
  const raw = JSON.parse(
    await readFile(resolve(import.meta.dirname, '../../../static/data/intro.json'), 'utf8')
  ) as { name: string }
  expect(intro.name).toBe(raw.name)
  const picture = skillIconsPicture(intro.skills)
  expect(picture.src).toMatch(/^https:\/\/simpleicons\.dev\/icons\?/)
  expect(picture.alt.length).toBeGreaterThan(0)
})
