import { expect, it } from 'vite-plus/test'

import { renderIntro } from '../src/intro.ts'
import { main } from '../src/main.ts'

it('renders the README-shaped introduction', () => {
  const text = renderIntro()

  expect(text).toContain("Hello, I'm Ari He")
  expect(text).toContain('Experience')
  expect(text).toContain('JD.com, Inc. · 2024.06 – Present')
  expect(text).toContain(
    '- Owned iterations for JD Takeout across the mini program, H5, and admin console'
  )
  expect(text).toContain('Skills')
  expect(text).toContain('Vue · React · Next · Rolldown · Vite · Oxc')
  expect(text).not.toContain('Open source')
  expect(text).not.toContain('hello@heyq02.com')
})

it('prints the intro by default and handles flags', () => {
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

  try {
    main(['--help'])
    expect(written).toContain('Usage: heyq02')
    expect(written).not.toContain('Experience')

    written = ''
    main(['--version'])
    expect(written).toMatch(/^\d+\.\d+\.\d+\n$/)

    written = ''
    main([])
    expect(written).toContain("Hello, I'm Ari He")
    expect(written).toContain('Experience')
    expect(written).toContain('Skills')

    process.exitCode = 0
    written = ''
    errors = ''
    main(['nope'])
    expect(process.exitCode).toBe(1)
    expect(errors).toContain('Unknown argument')
  } finally {
    process.stdout.write = stdoutWrite
    process.stderr.write = stderrWrite
    process.exitCode = 0
  }
})
