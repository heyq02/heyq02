import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { ensureEnglishPosts, findPlaceholders, placeholderFor } from '../scripts/en-placeholders.ts'

function site(root: string) {
  return join(root, 'apps/site')
}

/** Minimal committed English chrome templates (`apps/site/i18n/en`). */
async function writeChromeTemplates(dir: string) {
  await mkdir(join(dir, 'i18n/en/blog'), { recursive: true })
  await writeFile(join(dir, 'i18n/en/_nav.json'), '[]\n')
  await writeFile(join(dir, 'i18n/en/blog/index.md'), '---\noverview: true\ntitle: Blog\n---\n')
  await writeFile(join(dir, 'i18n/en/friends.mdx'), '---\ntitle: Friends\n---\n')
}

it('copies English chrome templates and creates a placeholder per Chinese post', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-en-placeholders-'))
  const dir = site(root)
  try {
    await writeChromeTemplates(dir)
    await mkdir(join(dir, 'blogs/zh/blog/posts'), { recursive: true })
    await mkdir(join(dir, 'blogs/zh/blog/interview'), { recursive: true })
    await writeFile(
      join(dir, 'blogs/zh/blog/posts/demo.md'),
      `---\ntitle: 中文标题\ndate: 2024-03-01\n---\n\n# 中文标题\n\n正文\n`
    )
    await writeFile(
      join(dir, 'blogs/zh/blog/interview/daily-2024-03-01.md'),
      `---\ntitle: 面经\n---\n\n# 面经\n`
    )
    // Chinese chrome exists too; the English version must come from the template.
    await writeFile(join(dir, 'blogs/zh/blog/index.md'), '---\noverview: true\ntitle: 博客\n---\n')
    await writeFile(join(dir, 'blogs/zh/friends.mdx'), '---\ntitle: 友链\n---\n')
    await writeFile(join(dir, 'blogs/zh/_nav.json'), '[]\n')

    await expect(ensureEnglishPosts({ siteRoot: dir })).resolves.toBe(2)

    const post = await readFile(join(dir, 'blogs/en/blog/posts/demo.md'), 'utf8')
    expect(post).toContain('title: 中文标题')
    expect(post).toContain('date: 2024-03-01')
    expect(post).toContain('[Read the Chinese original](/zh/blog/posts/demo/)')

    const interview = await readFile(
      join(dir, 'blogs/en/blog/interview/daily-2024-03-01.md'),
      'utf8'
    )
    expect(interview).toContain('/zh/blog/interview/daily-2024-03-01/')

    // Chrome comes from the tracked template, not from the Chinese tree.
    expect(await readFile(join(dir, 'blogs/en/_nav.json'), 'utf8')).toBe('[]\n')
    expect(await readFile(join(dir, 'blogs/en/blog/index.md'), 'utf8')).toContain('title: Blog')
    expect(await readFile(join(dir, 'blogs/en/friends.mdx'), 'utf8')).toContain('title: Friends')

    // A second run adds nothing and never overwrites translations.
    await writeFile(join(dir, 'blogs/en/blog/posts/demo.md'), '# Translated\n')
    await expect(ensureEnglishPosts({ siteRoot: dir })).resolves.toBe(0)
    expect(await readFile(join(dir, 'blogs/en/blog/posts/demo.md'), 'utf8')).toBe('# Translated\n')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('refreshes chrome from the template on every run', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-en-placeholders-chrome-'))
  const dir = site(root)
  try {
    await writeChromeTemplates(dir)
    await mkdir(join(dir, 'blogs/zh'), { recursive: true })
    await ensureEnglishPosts({ siteRoot: dir })

    await writeFile(join(dir, 'i18n/en/_nav.json'), '[{"text":"Home"}]\n')
    await ensureEnglishPosts({ siteRoot: dir })
    expect(await readFile(join(dir, 'blogs/en/_nav.json'), 'utf8')).toBe('[{"text":"Home"}]\n')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('returns zero placeholders when the Chinese tree is missing', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-en-placeholders-empty-'))
  const dir = site(root)
  try {
    await writeChromeTemplates(dir)
    await expect(ensureEnglishPosts({ siteRoot: dir })).resolves.toBe(0)
    expect(await readFile(join(dir, 'blogs/en/_nav.json'), 'utf8')).toBe('[]\n')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('falls back to Untitled when frontmatter and heading are missing', () => {
  const placeholder = placeholderFor('plain text', '/zh/blog/posts/x/')
  expect(placeholder).toContain('title: Untitled')
  expect(placeholder).toContain('# Untitled')
  expect(placeholder).not.toContain('date:')
})

it('rethrows when the Chinese tree path is not a directory', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-en-placeholders-notdir-'))
  const dir = site(root)
  try {
    await writeChromeTemplates(dir)
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, 'blogs'), 'x')
    await expect(ensureEnglishPosts({ siteRoot: dir })).rejects.toThrow(/ENOTDIR|ENOENT/)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('reuses an existing translated page instead of overwriting it', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-en-placeholders-keep-'))
  const dir = site(root)
  try {
    await writeChromeTemplates(dir)
    await mkdir(join(dir, 'blogs/zh/blog/posts'), { recursive: true })
    await mkdir(join(dir, 'blogs/en/blog/posts'), { recursive: true })
    await writeFile(join(dir, 'blogs/zh/blog/posts/kept.md'), '# 中文\n')
    await writeFile(join(dir, 'blogs/en/blog/posts/kept.md'), '# Translated\n')

    await expect(ensureEnglishPosts({ siteRoot: dir })).resolves.toBe(0)
    expect(await readFile(join(dir, 'blogs/en/blog/posts/kept.md'), 'utf8')).toBe('# Translated\n')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('walks nested directories and ignores non-markdown files', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-en-placeholders-nested-'))
  const dir = site(root)
  try {
    await writeChromeTemplates(dir)
    await mkdir(join(dir, 'blogs/zh/blog/posts/nested'), { recursive: true })
    await writeFile(join(dir, 'blogs/zh/blog/posts/nested/deep.md'), '# 深层\n')
    await writeFile(join(dir, 'blogs/zh/blog/posts/notes.txt'), 'ignore me')

    await expect(ensureEnglishPosts({ siteRoot: dir })).resolves.toBe(1)
    expect(await readFile(join(dir, 'blogs/en/blog/posts/nested/deep.md'), 'utf8')).toContain(
      '[Read the Chinese original](/zh/blog/posts/deep/)'
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('defaults the section to posts when the path is not under posts/interview', () => {
  const placeholder = placeholderFor('---\ntitle: T\n---\n', '/zh/blog/posts/t/')
  expect(placeholder).toContain('Read the Chinese original')
})

it('rethrows when reading the Chinese tree fails for a reason other than a missing dir', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-en-placeholders-bad-'))
  const dir = site(root)
  try {
    await writeChromeTemplates(dir)
    // `blogs/zh` being a file makes readdir fail with ENOTDIR instead of ENOENT.
    await mkdir(join(dir, 'blogs'), { recursive: true })
    await writeFile(join(dir, 'blogs/zh'), 'not a directory')
    await expect(ensureEnglishPosts({ siteRoot: dir })).rejects.toThrow(/ENOTDIR/)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('reports pages that are still placeholders', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-en-placeholders-find-'))
  const dir = site(root)
  try {
    await writeChromeTemplates(dir)
    await mkdir(join(dir, 'blogs/zh/blog/posts'), { recursive: true })
    await writeFile(join(dir, 'blogs/zh/blog/posts/pending.md'), '# 未翻译\n')
    await writeFile(join(dir, 'blogs/zh/blog/posts/done.md'), '# 已翻译\n')

    await ensureEnglishPosts({ siteRoot: dir })
    await writeFile(join(dir, 'blogs/en/blog/posts/done.md'), '# Translated\n')

    await expect(findPlaceholders({ siteRoot: dir })).resolves.toEqual(['blog/posts/pending.md'])
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('reports nothing when every page is translated', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-en-placeholders-clean-'))
  const dir = site(root)
  try {
    await writeChromeTemplates(dir)
    await ensureEnglishPosts({ siteRoot: dir })
    await expect(findPlaceholders({ siteRoot: dir })).resolves.toEqual([])
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('keeps chrome templates in place when only some posts are translated', async () => {
  const root = await mkdtemp(join(tmpdir(), 'heyq02-en-placeholders-mixed-'))
  const dir = site(root)
  try {
    await writeChromeTemplates(dir)
    await mkdir(join(dir, 'blogs/zh/blog/posts'), { recursive: true })
    await mkdir(join(dir, 'blogs/en/blog/posts'), { recursive: true })
    await writeFile(join(dir, 'blogs/zh/blog/posts/a.md'), '# A\n')
    await writeFile(join(dir, 'blogs/zh/blog/posts/b.md'), '# B\n')
    await writeFile(join(dir, 'blogs/en/blog/posts/a.md'), '# translated A\n')

    await expect(findPlaceholders({ siteRoot: dir })).resolves.toEqual([])
    await ensureEnglishPosts({ siteRoot: dir })
    await expect(findPlaceholders({ siteRoot: dir })).resolves.toEqual(['blog/posts/b.md'])
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
