import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

import { intro, skillIconsPicture } from '@heyq02/shared'
import { expect, it } from 'vite-plus/test'

import { renderReadme, writeReadme } from '../src/index.ts'

const committedReadme = resolve(import.meta.dirname, '../../../README.md')

it('builds the skills picture URL from skill icon slugs', () => {
  const { alt, src } = skillIconsPicture(intro.skills)

  expect(alt).toContain('Vue')
  expect(alt).toContain('Docker')
  expect(src).toMatch(/^https:\/\/simpleicons\.dev\/icons\?icons=.+&perline=\d+&theme=light$/)
  expect(src).toContain('vuedotjs')
})

it('renders the README-shaped markdown', async () => {
  const text = await renderReadme()

  expect(text).toContain(`# Hello, I'm ${intro.name}`)
  expect(text).not.toContain('<h1>')
  expect(text).not.toContain('<picture>')
  expect(text).not.toContain('你好，我是')
  expect(text).toContain(intro.tags.join(' · '))
  expect(text).toContain(`## ${intro.sections.experience}`)
  expect(text).toContain(`## ${intro.sections.skills}`)
  expect(text).not.toContain(`## ${intro.sections.writing}`)
  expect(text).toContain(`### [${intro.experiences[0]?.company}](${intro.experiences[0]?.href})`)
  expect(text).toContain(`- ${intro.experiences[0]?.points[0]}`)
  expect(text).toContain(`![`)
  expect(text).toContain('theme=light')
  expect(text).not.toContain('prefers-color-scheme')
})

it('matches the committed README', async () => {
  const committed = await readFile(committedReadme, 'utf8')
  expect(committed).toBe(`${(await renderReadme()).trimEnd()}\n`)
})

it('writes the rendered README to disk', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'heyq02-readme-'))
  const path = join(dir, 'README.md')

  try {
    await writeReadme(path)
    expect(await readFile(path, 'utf8')).toBe(`${(await renderReadme()).trimEnd()}\n`)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})
