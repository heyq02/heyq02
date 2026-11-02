import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { createDeepSeekTranslator, DEFAULT_BASE_URL, DEFAULT_MODEL } from './deepseek.ts'
import type { TranslateText } from './deepseek.ts'
import { blogRoots, translateBlog } from './translate.ts'
import type { TranslateBlogResult } from './translate.ts'

/** Cache file recording which Chinese sources already have translations. */
export const CACHE_FILE = 'apps/site/blogs/.translate-cache.json'

export interface TranslateBlogSiteOptions {
  siteRoot: string
  /** Pre-built translator; tests inject a fake, CI builds one from env vars. */
  translate: TranslateText
  cacheFile?: string
  chunkBudget?: number
  maxFileBytes?: number
}

async function readCache(file: string): Promise<Record<string, string>> {
  try {
    return JSON.parse(await readFile(file, 'utf8')) as Record<string, string>
  } catch {
    return {}
  }
}

/** Translate `blogs/zh` into `blogs/en`, then persist the incremental cache. */
export async function translateBlogSite(
  options: TranslateBlogSiteOptions
): Promise<TranslateBlogResult> {
  const { sourceRoot, targetRoot } = blogRoots(options.siteRoot)
  const cacheFile = options.cacheFile ?? resolve(options.siteRoot, '../..', CACHE_FILE)
  const result = await translateBlog({
    sourceRoot,
    targetRoot,
    translate: options.translate,
    cache: await readCache(cacheFile),
    chunkBudget: options.chunkBudget,
    maxFileBytes: options.maxFileBytes
  })
  await writeFile(cacheFile, `${JSON.stringify(result.cache, null, 2)}\n`, 'utf8')
  return result
}

/**
 * Translate using DeepSeek env vars. Requires `DEEPSEEK_API_KEY`;
 * `DEEPSEEK_BASE_URL` and `DEEPSEEK_MODEL` are optional overrides.
 */
export async function translateBlogWithEnv(siteRoot: string): Promise<TranslateBlogResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('Set DEEPSEEK_API_KEY to translate blog posts')
  }
  return translateBlogSite({
    siteRoot,
    translate: createDeepSeekTranslator({
      apiKey,
      baseUrl: process.env.DEEPSEEK_BASE_URL ?? DEFAULT_BASE_URL,
      model: process.env.DEEPSEEK_MODEL ?? DEFAULT_MODEL
    })
  })
}
