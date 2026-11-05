import { createPrepareOnce, writeIfChanged } from '@heyq02/rspress-plugin-utils'
import { documentTitleSuffix } from '@heyq02/rspress-site-content'
import type { Intro } from '@heyq02/rspress-site-content'
import type { RspressPlugin } from '@rspress/core'

/** Thin MDX shell — body UI lives in `@theme/ProfilePage`. Owned by the site app. */
export function renderHomeShellMdx(intro: Intro): string {
  return `---
pageType: doc-wide
title: ${JSON.stringify(intro.name)}
titleSuffix: ${JSON.stringify(documentTitleSuffix(intro))}
sidebar: false
outline: false
footer: false
---

import { ProfilePage } from '@theme/ProfilePage'

<ProfilePage />
`
}

export interface PluginHomeShellOptions {
  homeMdxPath: string
  intro: Intro
}

async function prepareHomeShell(options: PluginHomeShellOptions): Promise<void> {
  await writeIfChanged(options.homeMdxPath, renderHomeShellMdx(options.intro))
}

const prepareHomeShellOnce = createPrepareOnce(prepareHomeShell)

/** Keep `blogs/index.mdx` frontmatter in sync with intro (site-owned page shell). */
export function pluginHomeShell(options: PluginHomeShellOptions): RspressPlugin {
  return {
    name: 'heyq02-home-shell',
    async config(config) {
      await prepareHomeShellOnce(options)
      return config
    }
  }
}
