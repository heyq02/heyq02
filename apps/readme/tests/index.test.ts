import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it, vi } from 'vite-plus/test'

import intro from '../../../static/data/intro.json' with { type: 'json' }

it('builds the skills picture URL from brand slugs', async () => {
  const { skillsPicture } = await import('../src/index.ts')
  const { alt, src } = skillsPicture()

  expect(alt).toContain('Vue')
  expect(alt).toContain('Docker')
  expect(src).toMatch(/^https:\/\/simpleicons\.dev\/icons\?icons=.+&perline=\d+&theme=light$/)
  expect(src).toContain('vuedotjs')
})

it('keeps a usable picture URL when no skill has a brand slug', async () => {
  vi.resetModules()
  vi.doMock('@heyq02/brands', () => ({
    skillIconsPicture: () => ({
      alt: '',
      src: 'https://simpleicons.dev/icons?icons=&perline=1&theme=light'
    })
  }))
  const { skillsPicture } = await import('../src/index.ts')
  const { alt, src } = skillsPicture()
  expect(alt).toBe('')
  expect(src).toContain('perline=1')
  vi.doUnmock('@heyq02/brands')
  vi.resetModules()
})

it('renders the README-shaped markdown', async () => {
  const { renderReadme } = await import('../src/index.ts')
  const text = await renderReadme()

  expect(text).toContain(`# Hello, I'm ${intro.name}`)
  expect(text).not.toContain('<h1>')
  expect(text).not.toContain('<picture>')
  expect(text).not.toContain('你好，我是')
  expect(text).toContain(intro.tags.join(' · '))
  expect(text).toContain(`## ${intro.sections.experience}`)
  expect(text).toContain(`## ${intro.sections.skills}`)
  expect(text).toContain(`## ${intro.sections.writing}`)
  expect(text).toContain(`### [${intro.experiences[0]?.company}](${intro.experiences[0]?.href})`)
  expect(text).toContain(`- ${intro.experiences[0]?.points[0]}`)
  expect(text).toContain(`![`)
  expect(text).toContain('theme=light')
  expect(text).not.toContain('prefers-color-scheme')
  expect(text).toContain(`${intro.site}/blog/posts/`)
  expect(text).toMatch(/^### \[/m)
  expect(text).toContain('macOS')
})

it('writes the rendered README to disk', async () => {
  const { renderReadme, writeReadme } = await import('../src/index.ts')
  const dir = await mkdtemp(join(tmpdir(), 'heyq02-readme-'))
  const path = join(dir, 'README.md')

  try {
    await writeReadme(path)
    expect(await readFile(path, 'utf8')).toBe(`${(await renderReadme()).trimEnd()}\n`)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})
