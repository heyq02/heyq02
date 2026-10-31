#!/usr/bin/env node
import { pathToFileURL } from 'node:url'

import { Marked } from 'marked'
import { markedTerminal } from 'marked-terminal'

export const README_URL = 'https://raw.githubusercontent.com/heyq02/heyq02/main/README.md'
export const README_TIMEOUT_MS = 10_000

export function errorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

const marked = new Marked(markedTerminal())

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
  const rendered = await marked.parse(markdown)
  return `${rendered.trimEnd()}\n`
}

export function isCliEntry(entry = process.argv[1], moduleUrl = import.meta.url): boolean {
  if (!entry) {
    return false
  }
  return moduleUrl === pathToFileURL(entry).href
}

export async function run(): Promise<void> {
  try {
    process.stdout.write(await renderPreview(await fetchReadme()))
  } catch (error: unknown) {
    process.stderr.write(`${errorText(error)}\n`)
    process.exitCode = 1
  }
}

export async function start(entry = process.argv[1]): Promise<void> {
  if (isCliEntry(entry)) {
    await run()
  }
}

await start()
