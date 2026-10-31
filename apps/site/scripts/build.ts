import { spawn } from 'node:child_process'
import { cp, mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { renderHomeMdx } from '../src/profile-page.ts'

const dir = import.meta.dirname
const site = resolve(dir, '..')

async function run(command: string, args: string[]) {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { cwd: site, stdio: 'inherit' })
    child.on('exit', code => {
      if (code === 0) {
        resolve()
        return
      }
      reject(new Error(`${command} exited ${code}`))
    })
  })
}

const publicDir = resolve(site, 'blogs/public')
await mkdir(publicDir, { recursive: true })
await cp(resolve(site, '../../static/signature/full-nobg.ico'), resolve(publicDir, 'favicon.ico'))
await cp(resolve(site, '../../static/signature/full-nobg.png'), resolve(publicDir, 'favicon.png'))
await cp(resolve(site, 'public/wechat.jpg'), resolve(publicDir, 'wechat.jpg'))
await writeFile(resolve(site, 'blogs/index.mdx'), renderHomeMdx())
await run('pnpm', ['exec', 'rspress', 'build'])
await cp(resolve(site, 'CNAME'), resolve(site, 'dist/CNAME'))
