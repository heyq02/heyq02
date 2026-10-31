import type { RspressPlugin } from '@rspress/core'

import { prepareSiteOnce } from './prepare-site.ts'

/**
 * Regenerates homepage MDX, blog `_meta.json`, and public assets before Rspress
 * scans routes. Uses the `config` hook (runs before `addPages` / route scan);
 * there is no stock Rspress plugin for this, so the site owns one.
 */
export function pluginPrepareSite(): RspressPlugin {
  return {
    name: 'heyq02-prepare-site',
    async config(config) {
      await prepareSiteOnce()
      return config
    }
  }
}
