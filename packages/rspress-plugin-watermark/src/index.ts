import { join } from 'node:path'

import type { RspressPlugin } from '@rspress/core'

export interface PluginWatermarkOptions {
  /** Public URL of the watermark image, e.g. `/wuxian-jinbu.png`. */
  src: string
}

const packageRoot = join(import.meta.dirname, '..')

/** Absolute path of the React watermark component shipped with this package. */
export function watermarkComponentPath(): string {
  return join(packageRoot, 'static/Watermark.tsx')
}

/** Inject a fixed diagonal watermark behind Rspress chrome. */
export function pluginWatermark(options: PluginWatermarkOptions): RspressPlugin {
  if (!options.src) {
    throw new Error('@heyq02/rspress-plugin-watermark: `src` is required')
  }

  return {
    name: '@heyq02/rspress-plugin-watermark',
    globalUIComponents: [[watermarkComponentPath(), { src: options.src }]]
  }
}
