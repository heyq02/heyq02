import { readdir, readFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'

export interface BlogPost {
  slug: string
  href: string
  title: string
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

export async function listBlogPosts(
  postsDir = resolve(import.meta.dirname, '../blogs/blog/posts')
): Promise<BlogPost[]> {
  let files: string[]
  try {
    files = await readdir(postsDir)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }
    throw error
  }

  const posts: BlogPost[] = []
  for (const file of files) {
    if (!/\.mdx?$/.test(file) || file === 'index.md' || file === 'index.mdx') {
      continue
    }
    const raw = await readFile(resolve(postsDir, file), 'utf8')
    const { data, body } = parseFrontmatter(raw)
    const slug = basename(file).replace(/\.mdx?$/, '')
    posts.push({
      slug,
      href: `/blog/posts/${slug}/`,
      title: data.title || titleFromBody(body) || slug,
      description: data.description || '',
      date: data.date || ''
    })
  }
  return posts.toSorted(
    (a, b) => (b.date || '').localeCompare(a.date || '') || a.title.localeCompare(b.title)
  )
}

/** Sidebar meta for `/blog/`: Overview first, then the Posts group. */
export function renderBlogMetaJson(): string {
  return `${JSON.stringify(
    [
      { type: 'file', name: 'index', label: 'Overview' },
      { type: 'dir', name: 'posts', label: 'Posts' }
    ],
    null,
    2
  )}\n`
}

/** Sidebar meta for `/blog/posts/`: one entry per post file. */
export function renderPostsMetaJson(posts: BlogPost[]): string {
  return `${JSON.stringify(
    posts.map(post => ({
      type: 'file',
      name: post.slug,
      overviewHeaders: []
    })),
    null,
    2
  )}\n`
}
