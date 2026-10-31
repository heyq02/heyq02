import { spawn } from 'node:child_process'
import { resolve } from 'node:path'

const site = resolve(import.meta.dirname, '..')

// Homepage / meta / assets regenerate inside pluginPrepareSite (Rspress config hook).
const child = spawn('pnpm', ['exec', 'rspress', 'dev'], {
  cwd: site,
  stdio: 'inherit'
})

child.on('exit', code => {
  process.exit(code ?? 1)
})
