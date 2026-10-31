import { fileURLToPath } from 'node:url'

import { expect, it, vi } from 'vite-plus/test'

import { errorText, fetchReadme, isCliEntry, renderPreview, run, start } from '../src/index.ts'

const sample = `# Hello, I'm Yongqi He

## Experience

**[JD.com, Inc.](https://www.jd.com/)** · 2024.06 – Present

- Owned iterations

## Skills

![Vue, React](https://example.com/icons)
`

const indexPath = fileURLToPath(new URL('../src/index.ts', import.meta.url))

it('formats unknown errors as text', () => {
  expect(errorText(new Error('offline'))).toBe('offline')
  expect(errorText('offline')).toBe('offline')
})

it('recognizes only this file as the CLI entry', () => {
  expect(isCliEntry('', 'file:///index.ts')).toBe(false)
  expect(isCliEntry(indexPath, 'file:///other.ts')).toBe(false)
  expect(isCliEntry(indexPath)).toBe(true)
})

it('renders a terminal preview', async () => {
  const text = await renderPreview(sample)
  expect(text).toContain("Hello, I'm Yongqi He")
  expect(text).toContain('Experience')
  expect(text).toContain('JD.com, Inc.')
})

it('fetches the raw README and fails closed', async () => {
  const fetchImpl = vi.fn<typeof fetch>()
  fetchImpl.mockResolvedValueOnce(new Response('# Hello\n', { status: 200 }))
  await expect(fetchReadme(fetchImpl, 'https://example.com/README.md')).resolves.toBe('# Hello\n')
  expect(fetchImpl).toHaveBeenCalledWith('https://example.com/README.md', expect.any(Object))

  fetchImpl.mockResolvedValueOnce(new Response('nope', { status: 404, statusText: 'Not Found' }))
  await expect(fetchReadme(fetchImpl, 'https://example.com/README.md')).rejects.toThrow(
    /404 Not Found/
  )

  fetchImpl.mockRejectedValueOnce(new Error('offline'))
  await expect(fetchReadme(fetchImpl, 'https://example.com/README.md')).rejects.toThrow(
    /Failed to fetch README: offline/
  )

  fetchImpl.mockRejectedValueOnce('offline')
  await expect(fetchReadme(fetchImpl, 'https://example.com/README.md')).rejects.toThrow(
    /Failed to fetch README: offline/
  )
})

it('prints the README and ignores arguments', async () => {
  let written = ''
  let errors = ''
  const stdoutWrite = process.stdout.write.bind(process.stdout)
  const stderrWrite = process.stderr.write.bind(process.stderr)
  process.stdout.write = (chunk: string | Uint8Array) => {
    written += String(chunk)
    return true
  }
  process.stderr.write = (chunk: string | Uint8Array) => {
    errors += String(chunk)
    return true
  }
  const fetchImpl = vi.spyOn(globalThis, 'fetch')

  try {
    fetchImpl.mockImplementation(() => Promise.resolve(new Response(sample, { status: 200 })))
    await run()
    expect(written).toContain("Hello, I'm Yongqi He")
    expect(fetchImpl).toHaveBeenCalled()

    written = ''
    await start(indexPath)
    expect(written).toContain("Hello, I'm Yongqi He")

    await start('/not-the-cli.ts')
    expect(fetchImpl.mock.calls.length).toBe(2)

    fetchImpl.mockRejectedValueOnce(new Error('offline'))
    process.exitCode = 0
    errors = ''
    await run()
    expect(process.exitCode).toBe(1)
    expect(errors).toContain('Failed to fetch README: offline')
  } finally {
    process.stdout.write = stdoutWrite
    process.stderr.write = stderrWrite
    process.exitCode = 0
    fetchImpl.mockRestore()
  }
})
