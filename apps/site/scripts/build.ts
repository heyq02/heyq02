import { spawn } from 'node:child_process'
import { cp } from 'node:fs/promises'
import { resolve as resolvePath } from 'node:path'

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

// Homepage / meta / assets regenerate inside pluginPrepareSite (Rspress config hook).
await run('pnpm', ['exec', 'rspress', 'build'])
await cp(resolvePath(site, 'CNAME'), resolvePath(site, 'dist/CNAME'))
