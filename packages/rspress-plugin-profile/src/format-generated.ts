import { spawn } from 'node:child_process'

export async function formatGenerated(site: string, files: string[]): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn('pnpm', ['exec', 'vp', 'fmt', ...files], {
      cwd: site,
      stdio: 'inherit'
    })
    child.on('exit', code => {
      if (code === 0) {
        resolve()
        return
      }
      reject(new Error(`vp fmt exited ${code}`))
    })
  })
}
