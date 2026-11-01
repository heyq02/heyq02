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

/** Prefer frontmatter date; otherwise pull YYYY-MM-DD from the slug/filename. */
export function dateFromSlug(slug: string): string {
  return /\d{4}-\d{2}-\d{2}/.exec(slug)?.[0] ?? ''
}

async function listMarkdownEntries(dir: string, hrefPrefix: string): Promise<BlogPost[]> {
  let files: string[]
  try {
    files = await readdir(dir)
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
    const raw = await readFile(resolve(dir, file), 'utf8')
    const { data, body } = parseFrontmatter(raw)
    const slug = basename(file).replace(/\.mdx?$/, '')
    posts.push({
      slug,
      href: `${hrefPrefix}${slug}/`,
      title: data.title || titleFromBody(body) || slug,
      description: data.description || '',
      date: data.date || dateFromSlug(slug)
    })
  }
  return posts.toSorted(
    (a, b) => (b.date || '').localeCompare(a.date || '') || a.title.localeCompare(b.title)
  )
}

/** `/blog/posts/` sidebar entries (newest first). */
export async function listBlogPosts(postsDir: string): Promise<BlogPost[]> {
  return listMarkdownEntries(postsDir, '/blog/posts/')
}

/** `/blog/interview/` sidebar entries (newest first). */
export async function listInterviewNotes(interviewDir: string): Promise<BlogPost[]> {
  return listMarkdownEntries(interviewDir, '/blog/interview/')
}

/** Sidebar meta for `/blog/`: Overview, then Posts, then Interview. */
export function renderBlogMetaJson(): string {
  return `${JSON.stringify(
    [
      { type: 'file', name: 'index', label: 'Overview' },
      { type: 'dir', name: 'posts', label: 'Posts' },
      { type: 'dir', name: 'interview', label: 'Interview' }
    ],
    null,
    2
  )}\n`
}

/** Sidebar meta for a blog subsection: one entry per markdown file. */
export function renderPostsMetaJson(posts: BlogPost[]): string {
  return `${JSON.stringify(
    posts.map(post => ({
      type: 'file',
      name: post.slug,
      label: post.title,
      overviewHeaders: [2]
    })),
    null,
    2
  )}\n`
}
