import { expect, it } from 'vite-plus/test'

import { main } from '../src/main.ts'
import { renderPlain } from '../src/plain.ts'
import { formatCount, fullName, profile } from '../src/profile.ts'

it('keeps the intro site copy', () => {
  expect(fullName()).toBe('Ari He')
  expect(profile.bio).toBe(
    'Full-stack engineer / open-source enthusiast / vlogger on career. Focused on AI that speeds up development and ships in real products (๑•̀ㅂ•́)و'
  )
  expect(profile.phone).toBe('+86 135****8086')
  expect(profile.experiences[0]?.points).toEqual([
    'Owned iterations for JD Takeout across the mini program, H5, and admin console',
    'Upgraded the admin console off its legacy architecture and improved TP95',
    'Built C3-level AI Infra for Local Life product and engineering, improving R&D efficiency'
  ])
  expect(profile.skills.map(skill => skill.name)).toEqual([
    'Vue',
    'React',
    'Next',
    'Rolldown',
    'Vite',
    'Oxc',
    'Spring',
    'Redis',
    'RabbitMQ',
    'Nginx',
    'Docker'
  ])
})

it('formats star counts the same way as the site', () => {
  expect(formatCount(171)).toBe('171')
  expect(formatCount(1000)).toBe('1k')
  expect(formatCount(1500)).toBe('1.5k')
  expect(formatCount(4730)).toBe('4.7k')
})

it('prints a plain introduction without a phone link', () => {
  const text = renderPlain()

  expect(text).toContain('Ari He')
  expect(text).toContain('JD.com, Inc. · 2024.06 – Present')
  expect(text).toContain('jd-opensource/taro-ui · TypeScript · ★ 4.7k · 743 forks')
  expect(text).toContain('simpleicons.dev · TypeScript · ★ 171')
  expect(text).toContain('hello@heyq02.com')
  expect(text).not.toContain('tel:')
})

it('shows the profile by default and still routes hw', async () => {
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

  const stdoutTty = process.stdout.isTTY
  const stdinTty = process.stdin.isTTY
  Object.defineProperty(process.stdout, 'isTTY', {
    configurable: true,
    value: false
  })
  Object.defineProperty(process.stdin, 'isTTY', {
    configurable: true,
    value: false
  })

  try {
    await main(['--help'])
    expect(written).toContain('hw')
    expect(written).not.toContain('intro')

    written = ''
    await main([])
    expect(written).toContain(fullName())
    expect(written).toContain(profile.bio)

    written = ''
    await main(['hw'])
    expect(written).toBe('Hello, World!\n')

    process.exitCode = 0
    await main(['nope'])
    expect(process.exitCode).toBe(1)
    expect(errors.length).toBeGreaterThan(0)
  } finally {
    process.stdout.write = stdoutWrite
    process.stderr.write = stderrWrite
    Object.defineProperty(process.stdout, 'isTTY', {
      configurable: true,
      value: stdoutTty
    })
    Object.defineProperty(process.stdin, 'isTTY', {
      configurable: true,
      value: stdinTty
    })
    process.exitCode = 0
  }
})
