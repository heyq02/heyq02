import { render } from 'ink'

import { renderPlain } from './plain.ts'
import { IntroScreen } from './screen.tsx'

const enterScreen = '\u001B[?1049h\u001B[?25l'
const leaveScreen = '\u001B[?25h\u001B[?1049l'

export async function showIntro(): Promise<void> {
  if (!process.stdout.isTTY || !process.stdin.isTTY) {
    process.stdout.write(`${renderPlain()}\n`)
    return
  }

  process.stdout.write(enterScreen)
  try {
    const app = render(<IntroScreen />, { exitOnCtrlC: true })
    await app.waitUntilExit()
  } finally {
    process.stdout.write(leaveScreen)
  }
}
