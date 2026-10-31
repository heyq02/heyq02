import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { prepareSite } from '@heyq02/site-content'

/** Manual / CI helper to refresh committed generated snapshots with formatting. */
export async function prepareSiteCli() {
  await prepareSite({
    siteRoot: resolve(import.meta.dirname, '..'),
    format: true,
    profilePlayModule: '../theme/ProfilePlay'
  })
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await prepareSiteCli()
}
