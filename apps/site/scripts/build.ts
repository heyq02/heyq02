import { spawn } from 'node:child_process'
import { cp } from 'node:fs/promises'
import { resolve as resolvePath } from 'node:path'

import intro from '../../../content/data/intro.json' with { type: 'json' }
import { absolutizeMarkdownLinks } from './absolutize-md-links.ts'

const site = resolvePath(import.meta.dirname, '..')

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

// Homepage / meta / assets regenerate in the rspress-plugin-* config hooks.
await run('vp', ['exec', 'rspress', 'build'])

await absolutizeMarkdownLinks(resolvePath(site, 'dist'), intro.site)
await cp(resolvePath(site, 'CNAME'), resolvePath(site, 'dist/CNAME'))
