import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { prepareSiteCli } from './prepare.ts'

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await prepareSiteCli()
}
