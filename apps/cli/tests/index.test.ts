import { expect, it, vi } from 'vite-plus/test'

/** Import the side-effecting CLI entry with a stubbed TTY and captured `console.log`. */
async function captureOutput(isTTY: boolean): Promise<string[]> {
  const lines: string[] = []
  const log = vi.spyOn(console, 'log').mockImplementation((message: string) => {
    lines.push(message)
  })
  const descriptor = Object.getOwnPropertyDescriptor(process.stdout, 'isTTY')
  Object.defineProperty(process.stdout, 'isTTY', { value: isTTY, configurable: true })

  try {
    vi.resetModules()
    await import('../src/index.ts')
  } finally {
    log.mockRestore()
    if (descriptor) {
      Object.defineProperty(process.stdout, 'isTTY', descriptor)
    } else {
      Reflect.deleteProperty(process.stdout, 'isTTY')
    }
  }

  return lines
}

it('prints the greeting and every profile link as plain text when piped', async () => {
  const lines = await captureOutput(false)

  expect(lines[0]).toBe('Token is all your need 💰')
  expect(lines[2]).toBe('www ᐧ GitHub ᐧ 哔哩哔哩 ᐧ X ᐧ QQ')
  expect(lines.join('\n')).not.toContain('\u001B]8;;')
})

it('wraps each link in an OSC 8 hyperlink on a terminal', async () => {
  const lines = await captureOutput(true)
  const row = lines[2] ?? ''

  expect(row).toContain('\u001B]8;;https://heyq02.com\u001B\\www\u001B]8;;\u001B\\')
  expect(row).toContain(
    '\u001B]8;;https://space.bilibili.com/3493273159075938\u001B\\哔哩哔哩\u001B]8;;\u001B\\'
  )
  expect(row).toContain(' ᐧ ')
})
