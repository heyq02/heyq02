import type { RspressPlugin } from '@rspress/core'

import { translateBlogWithEnv } from './translate-blog-site.ts'

export interface PluginBlogTranslateOptions {
  siteRoot: string
}

/**
 * Translate `blogs/zh` into `blogs/en` before Rspress scans routes.
 *
 * Skipped (with a warning) when `DEEPSEEK_API_KEY` is absent, so local dev and
 * CI runs without the secret still build; only releases translate.
 */
export function pluginBlogTranslate(options: PluginBlogTranslateOptions): RspressPlugin {
  return {
    name: 'rspress-plugin-blog-translate',
    async config(config) {
      if (!process.env.DEEPSEEK_API_KEY) {
        // oxlint-disable-next-line no-console
        console.warn(
          '[blog-translate] DEEPSEEK_API_KEY is not set; using existing English translations.'
        )
        return config
      }
      const result = await translateBlogWithEnv(options.siteRoot)
      const translated = result.files.filter(file => file.translated).length
      // oxlint-disable-next-line no-console
      console.log(`[blog-translate] ${translated}/${result.files.length} files translated`)
      return config
    }
  }
}
