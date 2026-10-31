import { Marked } from 'marked'
import { markedTerminal } from 'marked-terminal'

export const README_URL = 'https://raw.githubusercontent.com/heyq02/heyq02/main/README.md'
export const README_TIMEOUT_MS = 10_000

export function errorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

const marked = new Marked(markedTerminal())

export function previewSource(markdown: string): string {
  return markdown
    .replaceAll(/<h1>([\s\S]*?)<\/h1>/gi, (_, text: string) => `# ${text.trim()}`)
    .replaceAll(/<picture>[\s\S]*?<\/picture>/gi, block => {
      const alt = /alt="([^"]*)"/.exec(block)?.[1]
      return alt ? `\n${alt}\n` : ''
    })
}

export async function fetchReadme(
  fetchImpl: typeof fetch = globalThis.fetch,
  url = README_URL
): Promise<string> {
  let response: Response
  try {
    response = await fetchImpl(url, { signal: AbortSignal.timeout(README_TIMEOUT_MS) })
  } catch (error: unknown) {
    throw new Error(`Failed to fetch README: ${errorText(error)}`, { cause: error })
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch README: ${response.status} ${response.statusText}`)
  }
  return response.text()
}

export async function renderPreview(markdown: string): Promise<string> {
  const rendered = await marked.parse(previewSource(markdown))
  return `${rendered.trimEnd()}\n`
}
