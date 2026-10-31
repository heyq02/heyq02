import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { prepareSite } from '../src/prepare-site.ts'

/** Manual / CI helper to refresh committed generated snapshots with formatting. */
export async function prepareSiteCli() {
  await prepareSite({
    siteRoot: resolve(import.meta.dirname, '..'),
    format: true
  })
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await prepareSiteCli()
}
