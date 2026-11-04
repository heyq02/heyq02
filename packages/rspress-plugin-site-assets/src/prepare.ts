import { cp, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

export interface PrepareSiteAssetsOptions {
  siteRoot: string
}

/** Copy favicon, signature, WeChat QR, and watermark into `blogs/public`. */
export async function prepareSiteAssets(options: PrepareSiteAssetsOptions): Promise<void> {
  const site = options.siteRoot
  const publicDir = resolve(site, 'blogs/public')
  const signature = resolve(site, '../../personal/signature.png')
  await mkdir(publicDir, { recursive: true })
  await cp(signature, resolve(publicDir, 'favicon.png'))
  await cp(signature, resolve(publicDir, 'signature.png'))
  await cp(resolve(site, 'public/wechat.jpg'), resolve(publicDir, 'wechat.jpg'))
  await cp(resolve(site, 'public/wuxian-jinbu.png'), resolve(publicDir, 'wuxian-jinbu.png'))
}

let prepareOnce: Promise<void> | undefined

export function prepareSiteAssetsOnce(options: PrepareSiteAssetsOptions): Promise<void> {
  prepareOnce ??= prepareSiteAssets(options)
  return prepareOnce
}
