import { cp } from 'node:fs/promises'
import { resolve } from 'node:path'

import type { RspressPlugin } from '@rspress/core'

import { absolutizeMarkdownLinks } from './absolutize-md-links.ts'

export { absolutizeMarkdownLinks } from './absolutize-md-links.ts'

export interface PluginSiteDistOptions {
  /** Absolute site origin for SSG-MD link rewriting (e.g. `https://heyq02.com`). */
  siteOrigin?: string
  /** Optional `CNAME` file copied into the production dist root. */
  cnamePath?: string
}

/** Post-process production dist: absolute SSG-MD links and optional GitHub Pages CNAME. */
export function pluginSiteDist(options: PluginSiteDistOptions = {}): RspressPlugin {
  return {
    name: '@heyq02/rspress-plugin-site-dist',
    async afterBuild(config, isProd) {
      if (!isProd) {
        return
      }
      const dist = resolve(config.outDir ?? 'doc_build')
      if (options.siteOrigin) {
        await absolutizeMarkdownLinks(dist, options.siteOrigin)
      }
      if (options.cnamePath) {
        await cp(options.cnamePath, resolve(dist, 'CNAME'))
      }
    }
  }
}
