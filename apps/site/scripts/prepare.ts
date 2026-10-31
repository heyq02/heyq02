import { cp, mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import intro from '../../../static/data/intro.json' with { type: 'json' }

/** Copy public assets and point `/` at the custom Rspress homepage. */
export async function prepareSite() {
  const site = resolve(import.meta.dirname, '..')
  const publicDir = resolve(site, 'blogs/public')
  await mkdir(publicDir, { recursive: true })
  await cp(resolve(site, '../../static/signature/full-nobg.ico'), resolve(publicDir, 'favicon.ico'))
  await cp(resolve(site, '../../static/signature/full-nobg.png'), resolve(publicDir, 'favicon.png'))
  await cp(resolve(site, 'public/wechat.jpg'), resolve(publicDir, 'wechat.jpg'))
  await writeFile(
    resolve(site, 'blogs/index.mdx'),
    `---\npageType: home\ntitle: ${JSON.stringify(intro.title)}\nfooter: false\n---\n`
  )
}
