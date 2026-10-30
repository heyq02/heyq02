import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it, vi } from 'vite-plus/test'

import intro from '../../../static/data/intro.json' with { type: 'json' }
import chinese from '../../../static/data/intro.zh.json' with { type: 'json' }

it('builds the skills picture URL from brand slugs', async () => {
  const { skillsPicture } = await import('../src/generate.ts')
  const { alt, base } = skillsPicture()

  expect(alt).toContain('Vue')
  expect(alt).toContain('Docker')
  expect(base).toMatch(/^https:\/\/simpleicons\.dev\/icons\?icons=.+&perline=\d+$/)
  expect(base).toContain('vuedotjs')
})

it('keeps a usable picture URL when no skill has a brand slug', async () => {
  vi.resetModules()
  vi.doMock('@heyq02/brands', () => ({ brandSlug: () => {} }))
  const { skillsPicture } = await import('../src/generate.ts')
  const { alt, base } = skillsPicture()
  expect(alt).toBe('')
  expect(base).toContain('perline=1')
  vi.doUnmock('@heyq02/brands')
  vi.resetModules()
})

it('renders the README-shaped markdown', async () => {
  const { renderReadme } = await import('../src/generate.ts')
  const text = renderReadme()

  expect(text).toContain(`<h1>你好，我是 ${intro.name}</h1>`)
  expect(text.indexOf(`<h1>你好，我是 ${intro.name}</h1>`)).toBeLessThan(
    text.indexOf(`<h1>Hello, I'm ${intro.name}</h1>`)
  )
  expect(text).toContain(`## ${chinese.sections.experience}`)
  expect(text).toContain(`## ${chinese.sections.skills}`)
  expect(text).toContain(`## ${intro.sections.experience}`)
  expect(text).toContain(`**[${chinese.experiences[0]?.company}](${intro.experiences[0]?.href})**`)
  expect(text).toContain(`- ${chinese.experiences[0]?.points[0]}`)
  expect(text).toContain(`**[${intro.experiences[0]?.company}](${intro.experiences[0]?.href})**`)
  expect(text).toContain('---')
  expect(text.indexOf('## 技能')).toBeLessThan(text.indexOf('---'))
  expect(text.slice(text.indexOf('---'))).not.toContain('## Skills')
  expect(text).toContain('prefers-color-scheme: dark')
  expect(text).toContain('theme=light')
})

it('rejects a Chinese experience list that does not match English', async () => {
  const { overlayExperiences } = await import('../src/generate.ts')
  expect(() => overlayExperiences(intro.experiences, [])).toThrow(
    /Chinese experiences \(0\) must match English/
  )
})

it('writes the rendered README to disk', async () => {
  const { renderReadme, writeReadme } = await import('../src/generate.ts')
  const dir = await mkdtemp(join(tmpdir(), 'heyq02-readme-'))
  const path = join(dir, 'README.md')

  try {
    await writeReadme(path)
    expect(await readFile(path, 'utf8')).toBe(`${renderReadme().trimEnd()}\n`)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})
