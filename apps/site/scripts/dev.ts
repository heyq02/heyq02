import { spawn } from 'node:child_process'
import { cp, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const site = resolve(import.meta.dirname, '..')
const publicDir = resolve(site, 'blogs/public')
await mkdir(publicDir, { recursive: true })
await cp(resolve(site, 'public/wechat.jpg'), resolve(publicDir, 'wechat.jpg'))

const child = spawn('pnpm', ['exec', 'rspress', 'dev'], {
  cwd: site,
  stdio: 'inherit'
})

child.on('exit', code => {
  process.exit(code ?? 1)
})
