import {
  command,
  description,
  name,
  parse,
  printErrors,
  printHelp,
  printVersion,
  version
} from '@bomb.sh/router'

import { showIntro } from './show.tsx'

const program = command(
  name('heyq02'),
  description('Ari He. Full-stack engineer.'),
  version('0.1.0'),
  command(name('intro'), description('Show the introduction. Any key exits.')),
  command(name('hw'), description('Print Hello, World!'))
)

export async function main(argv = process.argv.slice(2)): Promise<void> {
  const result = parse(program, { argv })

  if (!result.ok) {
    process.stderr.write(`${printErrors(result)}\n`)
    process.exitCode = 1
    return
  }

  switch (result.method) {
    case 'help': {
      process.stdout.write(`${printHelp(result)}\n`)
      break
    }
    case 'version': {
      process.stdout.write(`${printVersion(result)}\n`)
      break
    }
    case 'execute': {
      switch (result.route) {
        case '/': {
          const help = parse(program, { argv: ['--help'] })
          if (help.ok && help.method === 'help') {
            process.stdout.write(`${printHelp(help)}\n`)
          }
          break
        }
        case '/intro': {
          await showIntro()
          break
        }
        case '/hw': {
          process.stdout.write('Hello, World!\n')
          break
        }
        default: {
          break
        }
      }
      break
    }
    default: {
      break
    }
  }
}
