import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * AFDocs markdown-link-portability: root-relative links break once agents
 * drop the fetch base URL. Rewrite them to absolute https links, preferring
 * the SSG-MD `.md` sibling when the target is a site page.
 */
export async function absolutizeMarkdownLinks(dist: string, siteOrigin: string): Promise<void> {
  const origin = siteOrigin.replace(/\/$/, '')
  const files = await listMarkdownFiles(dist)
  const existing = new Set(
    files.map(file => `/${file.slice(dist.length + 1).replaceAll('\\', '/')}`)
  )

  await Promise.all(
    files.map(async file => {
      const source = await readFile(file, 'utf8')
      const next = source.replaceAll(/\]\((\/[^)\s#]+)(#[^)\s]*)?\)/g, (match, path, hash = '') => {
        const absolute = toAbsoluteMarkdownUrl(existing, origin, path as string)
        if (!absolute) {
          return match
        }
        return `](${absolute}${hash})`
      })
      if (next !== source) {
        await writeFile(file, next)
      }
    })
  )
}

async function listMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(path)))
      continue
    }
    if (entry.name.endsWith('.md') || entry.name === 'llms-full.txt') {
      files.push(path)
    }
  }
  return files
}

/** Resolve a root-relative path to an absolute URL (prefer `.md` sibling when present). */
export function toAbsoluteMarkdownUrl(
  existing: Set<string>,
  origin: string,
  pathname: string
): string | null {
  if (!pathname.startsWith('/') || pathname.startsWith('//')) {
    return null
  }

  const candidates: string[] = []
  if (pathname.endsWith('.md') || pathname.endsWith('.txt') || pathname.endsWith('.xml')) {
    candidates.push(pathname)
  } else if (pathname.endsWith('/')) {
    candidates.push(`${pathname}index.md`, `${pathname.slice(0, -1)}.md`)
  } else if (pathname.includes('.', pathname.lastIndexOf('/') + 1)) {
    candidates.push(pathname)
  } else {
    candidates.push(`${pathname}.md`, `${pathname}/index.md`)
  }

  for (const candidate of candidates) {
    if (existing.has(candidate)) {
      return `${origin}${candidate}`
    }
  }

  return `${origin}${pathname}`
}
