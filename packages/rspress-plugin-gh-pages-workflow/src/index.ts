import type { RspressPlugin } from '@rspress/core'

export interface PluginGhPagesWorkflowOptions {
  /**
   * Expected production outDir (absolute or relative to site package).
   * Documented for CI; validated lightly at config time when provided.
   */
  outDir?: string
}

/**
 * Marks the site as GitHub Actions Pages–deployed.
 * Does **not** push a branch on build (unlike community `rspress-plugin-gh-pages`).
 * Pair with this package's `action.yml` composite + `actions/deploy-pages`.
 * CNAME / SSG-MD rewriting stays in `@heyq02/rspress-plugin-site-dist`.
 */
export function pluginGhPagesWorkflow(options: PluginGhPagesWorkflowOptions = {}): RspressPlugin {
  return {
    name: '@heyq02/rspress-plugin-gh-pages-workflow',
    config(config) {
      if (options.outDir && !config.outDir) {
        config.outDir = options.outDir
      }
      return config
    }
  }
}
