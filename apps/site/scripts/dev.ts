import { spawn } from 'node:child_process'
import { cp, mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { renderHomeMdx } from '../src/profile-page.ts'

const site = resolve(import.meta.dirname, '..')
const publicDir = resolve(site, 'blogs/public')
await mkdir(publicDir, { recursive: true })
await cp(resolve(site, 'public/wechat.jpg'), resolve(publicDir, 'wechat.jpg'))
await writeFile(resolve(site, 'blogs/index.mdx'), renderHomeMdx())

const child = spawn('pnpm', ['exec', 'rspress', 'dev'], {
  cwd: site,
  stdio: 'inherit'
})

child.on('exit', code => {
  process.exit(code ?? 1)
})
