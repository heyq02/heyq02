import packageJson from '../package.json' with { type: 'json' }
import { errorText, fetchReadme, renderPreview } from './readme.ts'

const help = `Usage: heyq02

Fetch and print the GitHub README.

Options:
  -h, --help     Show help
  -v, --version  Show version
`

export async function main(argv = process.argv.slice(2)): Promise<void> {
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

  try {
    process.stdout.write(await renderPreview(await fetchReadme()))
  } catch (error: unknown) {
    process.stderr.write(`${errorText(error)}\n`)
    process.exitCode = 1
  }
}
