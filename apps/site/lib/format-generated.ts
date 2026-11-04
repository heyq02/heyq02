import { spawn } from 'node:child_process'
import type { ChildProcess } from 'node:child_process'

export type SpawnFn = typeof spawn

/** Run `vp fmt` on generated files. Injectable spawn for unit tests. */
export async function formatGenerated(
  site: string,
  files: string[],
  spawnFn: SpawnFn = spawn
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child: ChildProcess = spawnFn('pnpm', ['exec', 'vp', 'fmt', ...files], {
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
