import packageJson from '../package.json' with { type: 'json' }
import { renderIntro } from './intro.ts'

const help = `Usage: heyq02

Print Ari He's profile introduction.

Options:
  -h, --help     Show help
  -v, --version  Show version
`

export function main(argv = process.argv.slice(2)): void {
  const arg = argv[0]

  if (arg === '-h' || arg === '--help') {
    process.stdout.write(help)
    return
  }

  if (arg === '-v' || arg === '--version') {
    process.stdout.write(`${packageJson.version}\n`)
    return
  }

  if (arg) {
    process.stderr.write(`Unknown argument: ${arg}\n\n${help}`)
    process.exitCode = 1
    return
  }

  process.stdout.write(`${renderIntro()}\n`)
}
