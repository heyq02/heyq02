import { spawn } from 'node:child_process'
import { cp } from 'node:fs/promises'
import { resolve as resolvePath } from 'node:path'

import intro from '../../../static/data/intro.json' with { type: 'json' }
import { absolutizeMarkdownLinks } from './absolutize-md-links.ts'
import { ensureEnglishPosts, findPlaceholders } from './en-placeholders.ts'

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

// Fill any English gaps before Rspress scans routes (translations win when present).
const created = await ensureEnglishPosts({ siteRoot: site })
if (created > 0) {
  console.log(`[site] created ${created} English placeholder page(s)`)
}
// Homepage / meta / assets regenerate in rspress-plugin-* config hooks.
await run('pnpm', ['exec', 'rspress', 'build'])

// With a translation key configured, placeholders must not survive the build:
// Publishing them would silently ship untranslated pages.
if (process.env.DEEPSEEK_API_KEY) {
  const pending = await findPlaceholders({ siteRoot: site })
  if (pending.length > 0) {
    throw new Error(
      `Translation left ${pending.length} placeholder page(s), e.g. ${pending.slice(0, 3).join(', ')}`
    )
  }
}

await absolutizeMarkdownLinks(resolvePath(site, 'dist'), intro.site)
await cp(resolvePath(site, 'CNAME'), resolvePath(site, 'dist/CNAME'))
