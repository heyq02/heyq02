import { cp, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

export interface PrepareSiteAssetsOptions {
  /** Destination directory (typically `blogs/public`). */
  outDir: string
  /** Small square icon for `<link rel="icon">` (e.g. 192×192). */
  faviconPath: string
  /** Brand signature used for the site logo. */
  signaturePath: string
  wechatPath: string
  watermarkPath: string
}

/** Copy favicon, signature, WeChat QR, and watermark into `outDir`. */
export async function prepareSiteAssets(options: PrepareSiteAssetsOptions): Promise<void> {
  const { outDir, faviconPath, signaturePath, wechatPath, watermarkPath } = options
  await mkdir(outDir, { recursive: true })
  await cp(faviconPath, resolve(outDir, 'favicon.png'))
  await cp(signaturePath, resolve(outDir, 'signature.png'))
  await cp(wechatPath, resolve(outDir, 'wechat.jpg'))
  await cp(watermarkPath, resolve(outDir, 'wuxian-jinbu.png'))
}
