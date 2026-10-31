import type { RspressPlugin } from '@rspress/core'

export type { GraphqlClient, PinnedProject } from './github-pinned.ts'
export {
  PINNED_TIMEOUT_MS,
  fetchPinnedProjects,
  githubLogin,
  githubToken,
  mapPinnedRepository
} from './github-pinned.ts'

/**
 * Optional marker plugin: pinned fetch is a library used by `rspress-plugin-profile`.
 * Listed in site config when you want the dependency visible in the plugin stack.
 */
export function pluginGithubPins(): RspressPlugin {
  return {
    name: 'rspress-plugin-github-pins'
  }
}
