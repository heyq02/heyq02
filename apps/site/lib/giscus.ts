import type { ComponentProps } from 'react'
import type { Giscus } from 'rspress-plugin-giscus'

/**
 * Giscus → GitHub Discussions on heyq02/heyq02.
 * IDs from https://giscus.app (Announcements keeps new threads maintainer/giscus-only).
 */
export const friendsGiscus = {
  repo: 'heyq02/heyq02',
  repoId: 'R_kgDOUKgO2A',
  category: 'Announcements',
  categoryId: 'DIC_kwDOUKgO2M4DJqeQ',
  mapping: 'pathname',
  strict: '1',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top',
  lang: 'zh-CN',
  loading: 'lazy',
  theme: 'noborder_light'
} as const satisfies ComponentProps<typeof Giscus>
