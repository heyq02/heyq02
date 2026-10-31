import { spawn } from 'node:child_process'
import { resolve } from 'node:path'

import { prepareSite } from './prepare.ts'

const site = resolve(import.meta.dirname, '..')
await prepareSite()

const child = spawn('pnpm', ['exec', 'rspress', 'dev'], {
  cwd: site,
  stdio: 'inherit'
})

child.on('exit', code => {
  process.exit(code ?? 1)
})
