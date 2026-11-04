import { cp, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

export interface PrepareSiteAssetsOptions {
  /** Destination directory (typically `blogs/public`). */
  outDir: string
  /** Brand signature used for favicon + logo. */
  signaturePath: string
  wechatPath: string
  watermarkPath: string
}

/** Copy favicon, signature, WeChat QR, and watermark into `outDir`. */
export async function prepareSiteAssets(options: PrepareSiteAssetsOptions): Promise<void> {
  const { outDir, signaturePath, wechatPath, watermarkPath } = options
  await mkdir(outDir, { recursive: true })
  await cp(signaturePath, resolve(outDir, 'favicon.png'))
  await cp(signaturePath, resolve(outDir, 'signature.png'))
  await cp(wechatPath, resolve(outDir, 'wechat.jpg'))
  await cp(watermarkPath, resolve(outDir, 'wuxian-jinbu.png'))
}

let prepareOnce: Promise<void> | undefined

export function prepareSiteAssetsOnce(options: PrepareSiteAssetsOptions): Promise<void> {
  prepareOnce ??= prepareSiteAssets(options)
  return prepareOnce
}
