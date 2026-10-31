import { resolve } from 'node:path'

import { prepareBlogMeta } from 'rspress-plugin-blog-meta'
import { prepareProfile } from 'rspress-plugin-profile'
import { prepareSiteAssets } from 'rspress-plugin-site-assets'

/** Manual / CI helper to refresh committed generated snapshots with formatting. */
export async function prepareSiteCli() {
  const siteRoot = resolve(import.meta.dirname, '..')
  await prepareSiteAssets({ siteRoot })
  await prepareBlogMeta({ siteRoot, format: true })
  await prepareProfile({
    siteRoot,
    format: true,
    profilePlayModule: '@theme/ProfilePlay'
  })
}
