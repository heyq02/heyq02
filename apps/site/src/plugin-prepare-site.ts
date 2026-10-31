import { resolve } from 'node:path'

import { prepareSiteOnce } from '@heyq02/site-content'
import type { RspressPlugin } from '@rspress/core'

/**
 * Regenerates homepage MDX, blog `_meta.json`, and public assets before Rspress
 * scans routes. Uses the `config` hook (runs before `addPages` / route scan);
 * there is no stock Rspress plugin for this, so the site owns a thin shim that
 * calls `@heyq02/site-content`.
 */
export function pluginPrepareSite(): RspressPlugin {
  return {
    name: 'heyq02-prepare-site',
    async config(config) {
      await prepareSiteOnce({
        siteRoot: resolve(import.meta.dirname, '..'),
        profilePlayModule: '../theme/ProfilePlay'
      })
      return config
    }
  }
}
