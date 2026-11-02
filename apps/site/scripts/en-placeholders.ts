/// <reference types="node" />
/**
 * Materialize the English locale tree under `blogs/en` at build time.
 *
 * English is build output only: nothing under `blogs/en` is committed. This
 * script copies the hand-written English chrome (nav, friends, blog overview)
 * from `apps/site/i18n/en`, then fills any post that DeepSeek has not
 * translated yet with a placeholder pointing at the Chinese original.
 *
 * Only missing files are written, so real translations are never overwritten.
 */
import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'

export interface EnsureEnglishOptions {
  siteRoot: string
}

/** Files that must be produced per locale but are not translated posts. */
export const CHROME_FILES = ['_nav.json', 'friends.mdx', 'blog/index.md'] as const

async function listMarkdown(dir: string): Promise<string[]> {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }
    throw error
  }
  const files: string[] = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await listMarkdown(full)))
      continue
    }
    if (/\.mdx?$/.test(entry.name)) {
      files.push(full)
    }
  }
  return files.toSorted()
}

async function exists(path: string) {
  try {
    await readFile(path)
    return true
  } catch {
    return false
  }
}

/** Placeholder page pointing readers at the Chinese original. */
export function placeholderFor(markdown: string, originalRoute: string): string {
  const title = /^title:\s*(.+)$/m.exec(markdown)?.[1]?.trim() ?? 'Untitled'
  const date = /^date:\s*(.+)$/m.exec(markdown)?.[1]?.trim()
  const heading = /^#\s+(.+)$/m.exec(markdown)?.[1]?.trim() ?? title
  return `---
title: ${title}
${date ? `date: ${date}\n` : ''}---

# ${heading}

::: info {title="Translation pending"}
This post was written in Chinese. Its English translation is produced by DeepSeek during the
release build; this page is a placeholder until then.

[Read the Chinese original](${originalRoute})
:::
`
}

/** Route of the Chinese page a placeholder mirrors (`/zh/blog/posts/<slug>/`). */
export function originalRouteOf(key: string): string {
  const section = /blog\/(posts|interview)\//.exec(key)?.[1] ?? 'posts'
  const slug = (/([^/]+)\.mdx?$/.exec(key)?.[1] ?? key).replace(/\.mdx?$/, '')
  return `/zh/blog/${section}/${slug}/`
}

/**
 * Copy `i18n/en` chrome into `blogs/en` (overwriting, so template edits apply),
 * then add a placeholder for every Chinese post still missing an English page.
 * Returns how many placeholders were created.
 */
export async function ensureEnglishPosts(options: EnsureEnglishOptions): Promise<number> {
  const site = options.siteRoot
  const templateRoot = resolve(site, 'i18n/en')
  const targetRoot = resolve(site, 'blogs/en')

  for (const file of CHROME_FILES) {
    const target = join(targetRoot, file)
    await mkdir(dirname(target), { recursive: true })
    await copyFile(join(templateRoot, file), target)
  }

  const sourceRoot = resolve(site, 'blogs/zh')
  let created = 0
  for (const source of await listMarkdown(sourceRoot)) {
    const key = relative(sourceRoot, source).replaceAll('\\', '/')
    if ((CHROME_FILES as readonly string[]).includes(key)) {
      continue
    }
    const target = join(targetRoot, key)
    if (await exists(target)) {
      continue
    }
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, placeholderFor(await readFile(source, 'utf8'), originalRouteOf(key)))
    created += 1
  }
  return created
}
