/// <reference types="node" />
import { spawn } from 'node:child_process'

const env = {
  ...process.env,
  GH_TOKEN: process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN
}

if (!env.GH_TOKEN) {
  throw new Error('Set GH_TOKEN or GITHUB_TOKEN for site e2e build (pinned repos)')
}

// Match production `cbuild`: rspress build + absolutize SSG-MD + CNAME.
await new Promise<void>((resolve, reject) => {
  const child = spawn('pnpm', ['--filter', '@heyq02/site', 'run', 'build'], {
    env,
    stdio: 'inherit'
  })
  child.on('exit', (code: number | null) => {
    if (code === 0) {
      resolve()
      return
    }
    reject(new Error(`@heyq02/site build exited ${code}`))
  })
})
