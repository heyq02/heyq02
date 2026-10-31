import { readdir, readFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'

export interface WritingPost {
  title: string
  href: string
  description: string
  date: string
}

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  if (!raw.startsWith('---\n')) {
    return { data: {}, body: raw }
  }
  const end = raw.indexOf('\n---\n', 4)
  if (end === -1) {
    return { data: {}, body: raw }
  }
  const data: Record<string, string> = {}
  for (const line of raw.slice(4, end).split('\n')) {
    const match = /^(?<key>[A-Za-z][\w-]*)\s*:\s*(?<value>.*)$/.exec(line)
    if (!match?.groups) {
      continue
    }
    data[match.groups.key] = match.groups.value.replaceAll(/^["']|["']$/g, '').trim()
  }
  return { data, body: raw.slice(end + 5) }
}

function titleFromBody(body: string) {
  const heading = /^#\s+(.+)$/m.exec(body)?.[1] ?? ''
  return heading
    .replace(/^[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F\u200D\s]+/u, '')
    .trim()
}

/** Blog posts for the README Writing section, with absolute site URLs. */
export async function listWritingPosts(
  site: string,
  postsDir = resolve(import.meta.dirname, '../../site/blogs/blog/posts')
): Promise<WritingPost[]> {
  let files: string[]
  try {
    files = await readdir(postsDir)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }
    throw error
  }

  const posts: WritingPost[] = []
  for (const file of files) {
    if (!/\.mdx?$/.test(file) || file === 'index.md' || file === 'index.mdx') {
      continue
    }
    const raw = await readFile(resolve(postsDir, file), 'utf8')
    const { data, body } = parseFrontmatter(raw)
    const slug = basename(file).replace(/\.mdx?$/, '')
    posts.push({
      title: data.title || titleFromBody(body) || slug,
      href: `${site.replace(/\/$/, '')}/blog/posts/${slug}/`,
      description: data.description || '',
      date: data.date || ''
    })
  }
  return posts.toSorted(
    (a, b) => (b.date || '').localeCompare(a.date || '') || a.title.localeCompare(b.title)
  )
}
