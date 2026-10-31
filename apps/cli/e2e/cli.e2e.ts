import { spawn } from 'node:child_process'
import { resolve } from 'node:path'

import { expect, it } from 'vite-plus/test'

it('cli e2e: prints README preview containing the intro name', async () => {
  const entry = resolve(import.meta.dirname, '../src/index.ts')
  const stdout = await new Promise<string>((resolve, reject) => {
    const child = spawn(process.execPath, ['--experimental-strip-types', entry], {
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe']
    })
    let out = ''
    let err = ''
    child.stdout.on('data', chunk => {
      out += String(chunk)
    })
    child.stderr.on('data', chunk => {
      err += String(chunk)
    })
    child.on('exit', code => {
      if (code === 0) {
        resolve(out)
        return
      }
      reject(new Error(`cli exited ${code}: ${err || out}`))
    })
  })
  expect(stdout).toContain('Ari')
})
