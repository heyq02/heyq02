import { cp } from 'node:fs/promises'
import { resolve } from 'node:path'

import type { RspressPlugin } from '@rspress/core'

import { absolutizeMarkdownLinks } from './absolutize-md-links.ts'
import { prepareSiteAssetsOnce } from './prepare-site-assets.ts'
import type { PrepareSiteAssetsOptions } from './prepare-site-assets.ts'

export { absolutizeMarkdownLinks } from './absolutize-md-links.ts'
export { prepareSiteAssets, prepareSiteAssetsOnce } from './prepare-site-assets.ts'
export type { PrepareSiteAssetsOptions } from './prepare-site-assets.ts'

export interface PluginSiteAssetsOptions extends PrepareSiteAssetsOptions {
  /** Absolute site origin for SSG-MD link rewriting (e.g. `https://heyq02.com`). */
  siteOrigin?: string
  /** Optional `CNAME` file copied into the production dist root. */
  cnamePath?: string
}

/** Prepare public assets before scan; post-process dist after production build. */
export function pluginSiteAssets(options: PluginSiteAssetsOptions): RspressPlugin {
  if (!options.outDir || !options.signaturePath || !options.wechatPath || !options.watermarkPath) {
    throw new Error(
      '@heyq02/rspress-plugin-site-assets: `outDir`, `signaturePath`, `wechatPath`, and `watermarkPath` are required'
    )
  }

  return {
    name: '@heyq02/rspress-plugin-site-assets',
    async config(config) {
      await prepareSiteAssetsOnce(options)
      return config
    },
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
