/**
 * Validate committed `content/data/*.json` shapes without a site build.
 * Local / CI: `vp run @heyq02/site#cvalidate-content`.
 */
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import {
  assertFriendsData,
  assertGithubProfileData,
  assertIntro,
  assertRecentPosts
} from '@heyq02/rspress-site-content'

const repoRoot = resolve(import.meta.dirname, '../../..')
const dataDir = resolve(repoRoot, 'content/data')

async function readJson(name: string): Promise<unknown> {
  return JSON.parse(await readFile(resolve(dataDir, name), 'utf8')) as unknown
}

const intro = assertIntro(await readJson('intro.json'))
assertFriendsData(await readJson('friends.json'))
assertGithubProfileData(await readJson('github-profile.json'))
assertRecentPosts(await readJson('recent-posts.json'))

console.log(`content/data ok (${intro.name})`)
