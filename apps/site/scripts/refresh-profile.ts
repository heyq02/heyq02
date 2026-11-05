/**
 * Fetch GitHub pins + contribution calendar → `content/data/github-profile.json`.
 * CI / local: `vp run @heyq02/site#crefresh-profile` (needs `GITHUB_TOKEN`).
 */
import { resolve } from 'node:path'

import { prepareProfile } from '@heyq02/rspress-plugin-profile'

import intro from '../../../content/data/intro.json' with { type: 'json' }

const repoRoot = resolve(import.meta.dirname, '../../..')

await prepareProfile({
  dataPath: resolve(repoRoot, 'content/data/github-profile.json'),
  intro
})
