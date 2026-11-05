import { join } from 'node:path'

import type { RspressPlugin } from '@rspress/core'

export interface PluginAnnotationWordsOptions {
  /** Public URL path to the words map JSON (served from site `public/`). */
  wordsMapPath: string
  ignoreWords?: string[]
  ignorePaths?: RegExp[]
}

const packageRoot = join(import.meta.dirname, '..')

/** Absolute path of the React annotation component shipped with this package. */
export function annotationWordsComponentPath(): string {
  return join(packageRoot, 'static/AnnotationWords.tsx')
}

function serializeIgnorePaths(ignorePaths: RegExp[]): [string, string][] {
  return ignorePaths.map(path => [path.source, path.flags])
}

/**
 * Highlight glossary terms in `.rspress-doc` and show a popover on click.
 * Rspress v2-compatible replacement for `rspress-plugin-annotation-words` (v1 peer).
 */
export function pluginAnnotationWords(options: PluginAnnotationWordsOptions): RspressPlugin {
  if (!options.wordsMapPath) {
    throw new Error('@heyq02/rspress-plugin-annotation-words: `wordsMapPath` is required')
  }

  return {
    name: '@heyq02/rspress-plugin-annotation-words',
    globalUIComponents: [
      [
        annotationWordsComponentPath(),
        {
          wordsMapPath: options.wordsMapPath.replace(/^\//, ''),
          ignoreWords: options.ignoreWords ?? [],
          ignorePaths: serializeIgnorePaths(options.ignorePaths ?? [])
        }
      ]
    ]
  }
}
