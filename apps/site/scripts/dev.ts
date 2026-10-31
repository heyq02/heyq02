import { spawn } from 'node:child_process'
import { resolve } from 'node:path'

const child = spawn('pnpm', ['exec', 'rspress', 'dev'], {
  cwd: resolve(import.meta.dirname, '..'),
  stdio: 'inherit'
})

child.on('exit', code => {
  process.exit(code ?? 1)
})
