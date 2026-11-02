/// <reference types="node" />
import { resolve } from 'node:path'

import { ensureEnglishPosts } from './en-placeholders.ts'

/** Fill missing English pages before `rspress dev` (translations win when present). */
const siteRoot = resolve(import.meta.dirname, '..')
const created = await ensureEnglishPosts({ siteRoot })
if (created > 0) {
  console.log(`[site] created ${created} English placeholder page(s)`)
}
