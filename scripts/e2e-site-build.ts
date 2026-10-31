import { spawn } from 'node:child_process'

const env = {
  ...process.env,
  GH_TOKEN: process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN
}

if (!env.GH_TOKEN) {
  throw new Error('Set GH_TOKEN or GITHUB_TOKEN for site e2e build (pinned repos)')
}

await new Promise<void>((resolve, reject) => {
  const child = spawn('pnpm', ['--filter', '@heyq02/site', 'exec', 'rspress', 'build'], {
    env,
    stdio: 'inherit'
  })
  child.on('exit', code => {
    if (code === 0) {
      resolve()
      return
    }
    reject(new Error(`rspress build exited ${code}`))
  })
})
