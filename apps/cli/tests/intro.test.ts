import { expect, it, vi } from 'vite-plus/test'

import { main } from '../src/main.ts'
import { errorText, fetchReadme, previewSource, renderPreview } from '../src/readme.ts'

const sample = `<h1>Hello, I'm Ari He</h1>

## Experience

**[JD.com, Inc.](https://www.jd.com/)** · 2024.06 – Present

- Owned iterations

## Skills

<picture>
  <img alt="Vue, React" src="https://example.com/icons" />
</picture>
`

it('formats unknown errors as text', () => {
  expect(errorText(new Error('offline'))).toBe('offline')
  expect(errorText('offline')).toBe('offline')
})

it('turns the README heading and picture into terminal markdown', () => {
  const source = previewSource(sample)
  expect(source).toContain("# Hello, I'm Ari He")
  expect(source).not.toContain('<h1>')
  expect(source).toContain('Vue, React')
  expect(source).not.toContain('<picture>')
  expect(previewSource('<picture></picture>')).not.toContain('picture')
})

it('renders a terminal preview', async () => {
  const text = await renderPreview(sample)
  expect(text).toContain("Hello, I'm Ari He")
  expect(text).toContain('Experience')
  expect(text).toContain('JD.com, Inc.')
  expect(text).not.toContain('<h1>')
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

it('prints the fetched preview by default and keeps flags offline', async () => {
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
    await main(['--help'])
    expect(written).toContain('Usage: heyq02')
    expect(fetchImpl).not.toHaveBeenCalled()

    written = ''
    await main(['--version'])
    expect(written).toMatch(/^\d+\.\d+\.\d+\n$/)
    expect(fetchImpl).not.toHaveBeenCalled()

    fetchImpl.mockResolvedValueOnce(new Response(sample, { status: 200 }))
    written = ''
    await main([])
    expect(written).toContain("Hello, I'm Ari He")
    expect(written).not.toContain('<h1>')
    expect(fetchImpl).toHaveBeenCalledOnce()

    process.exitCode = 0
    written = ''
    errors = ''
    await main(['nope'])
    expect(process.exitCode).toBe(1)
    expect(errors).toContain('Unknown argument')
    expect(fetchImpl).toHaveBeenCalledOnce()

    fetchImpl.mockRejectedValueOnce('offline')
    process.exitCode = 0
    errors = ''
    await main([])
    expect(process.exitCode).toBe(1)
    expect(errors).toContain('offline')
  } finally {
    process.stdout.write = stdoutWrite
    process.stderr.write = stderrWrite
    process.exitCode = 0
    fetchImpl.mockRestore()
  }
})
