import { cleanup, render } from 'ink-testing-library'
import { afterEach, expect, it } from 'vite-plus/test'

import { fullName } from '../src/profile.ts'

// Node 26 links static imports in parallel. ink-testing-library imports Ink,
// So the screen is loaded after that import finishes. A static import reads
// `measureElement` before the binding is initialized.
async function loadIntroScreen() {
  const { IntroScreen } = await import('../src/screen.tsx')
  return IntroScreen
}

afterEach(() => {
  cleanup()
})

it('keeps the introduction on screen until a key is pressed', async () => {
  const IntroScreen = await loadIntroScreen()
  let exited = false
  const view = render(
    <IntroScreen
      columns={100}
      rows={32}
      onExit={() => {
        exited = true
      }}
    />
  )
  const frame = view.lastFrame() ?? ''

  expect(frame).toContain(`Hello, I'm ${fullName()}`)
  expect(frame).toContain('Experience')
  expect(frame).toContain('JD.com, Inc.')
  expect(frame).toContain(
    'Owned iterations for JD Takeout across the mini program, H5, and admin console'
  )
  expect(frame).toContain('Skills')
  expect(frame).toContain('Vue')
  expect(frame).toContain('any key to exit')
  expect(frame).not.toContain('Open source')
  expect(frame).not.toContain('hello@heyq02.com')

  view.stdin.write('x')
  expect(exited).toBe(true)
  view.unmount()
})

it('still shows the greeting on a short screen', async () => {
  const IntroScreen = await loadIntroScreen()
  const view = render(<IntroScreen columns={80} rows={16} />)
  const frame = view.lastFrame() ?? ''

  expect(frame).toContain(`Hello, I'm ${fullName()}`)
  expect(frame).toContain('Experience')
  expect(frame).toContain('Skills')
  expect(frame).toContain('any key to exit')
  view.unmount()
})
