import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'

import { chunkText, protectCodeBlocks, restoreCodeBlocks } from './chunk.ts'
import type { TranslateText } from './deepseek.ts'

export interface TranslateBlogOptions {
  /** Directory holding the Chinese sources, e.g. `apps/site/blogs/zh`. */
  sourceRoot: string
  /** Directory receiving English output, e.g. `apps/site/blogs/en`. */
  targetRoot: string
  translate: TranslateText
  /**
   * Content hash of the source, keyed by relative path. When the recorded hash
   * is unchanged the existing translation is reused, so CI only pays for edits.
   */
  cache?: Record<string, string>
  /** Max characters per translation request. */
  chunkBudget?: number
  /** Files are only translated below this size; larger ones are copied as-is. */
  maxFileBytes?: number
}

export interface TranslatedFile {
  path: string
  hash: string
  translated: boolean
}

export interface TranslateBlogResult {
  files: TranslatedFile[]
  cache: Record<string, string>
}

/** Stable, dependency-free content hash (FNV-1a, hex). */
export function contentHash(text: string): string {
  // 2166136261 / 16777619 are the FNV-1a 32-bit offset basis and prime.
  let hash = 2_166_136_261
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.codePointAt(index) ?? 0
    hash = Math.imul(hash, 16_777_619) >>> 0
  }
  return `${hash.toString(16)}-${text.length}`
}

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

/** Translate one Markdown document, keeping frontmatter, code, and links intact. */
export async function translateMarkdown(
  markdown: string,
  translate: TranslateText,
  chunkBudget = 4000
): Promise<string> {
  const { frontmatter, body } = splitFrontmatter(markdown)
  const { text, blocks } = protectCodeBlocks(body.trim())
  const chunks = chunkText(text, chunkBudget)
  const translatedChunks: string[] = []
  for (const chunk of chunks) {
    translatedChunks.push(await translate(chunk))
  }
  const restored = restoreCodeBlocks(translatedChunks.join('\n\n'), blocks)
  return frontmatter ? `${frontmatter}\n\n${restored.trim()}\n` : `${restored.trim()}\n`
}

/** Split YAML frontmatter (kept verbatim) from the Markdown body. */
export function splitFrontmatter(markdown: string): { frontmatter: string; body: string } {
  if (!markdown.startsWith('---\n')) {
    return { frontmatter: '', body: markdown }
  }
  const end = markdown.indexOf('\n---\n', 4)
  if (end === -1) {
    return { frontmatter: '', body: markdown }
  }
  return {
    frontmatter: markdown.slice(0, end + 5),
    body: markdown.slice(end + 5)
  }
}

/**
 * Translate every Chinese Markdown file into the English tree.
 * Unchanged sources reuse their cached translation instead of calling the API.
 */
export async function translateBlog(options: TranslateBlogOptions): Promise<TranslateBlogResult> {
  const cache: Record<string, string> = { ...options.cache }
  const files: TranslatedFile[] = []

  for (const source of await listMarkdown(options.sourceRoot)) {
    const key = relative(options.sourceRoot, source).replaceAll('\\', '/')
    const raw = await readFile(source, 'utf8')
    const hash = contentHash(raw)
    const target = join(options.targetRoot, key)
    const cached = cache[key] === hash && (await exists(target))

    if (cached) {
      cache[key] = hash
      files.push({ path: key, hash, translated: false })
      continue
    }

    const result = await translateOrCopy(raw, options)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, result.text, 'utf8')
    cache[key] = hash
    files.push({ path: key, hash, translated: result.didTranslate })
  }

  return { files, cache }
}

async function exists(path: string) {
  try {
    await readFile(path)
    return true
  } catch {
    return false
  }
}

async function translateOrCopy(raw: string, options: TranslateBlogOptions) {
  const size = Buffer.byteLength(raw, 'utf8')
  const limit = options.maxFileBytes ?? 60_000
  if (size > limit) {
    // Huge reference dumps (e.g. stdlib link lists) are mostly proper nouns;
    // Copying keeps the run cheap while still publishing the page.
    return { text: raw, didTranslate: false }
  }
  return {
    text: await translateMarkdown(raw, options.translate, options.chunkBudget),
    didTranslate: true
  }
}

/** Resolve the blog trees for `apps/site`, given the site root. */
export function blogRoots(siteRoot: string) {
  return {
    sourceRoot: resolve(siteRoot, 'blogs/zh'),
    targetRoot: resolve(siteRoot, 'blogs/en')
  }
}
