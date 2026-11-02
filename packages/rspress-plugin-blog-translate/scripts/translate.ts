/// <reference types="node" />
import { resolve } from 'node:path'

import { translateBlogWithEnv } from '../src/index.ts'

const siteRoot = resolve(import.meta.dirname, '../../../apps/site')
const result = await translateBlogWithEnv(siteRoot)

const translated = result.files.filter(file => file.translated).length
console.log(`blog translate: ${translated}/${result.files.length} files translated`)
