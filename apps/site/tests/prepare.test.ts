import { expect, it, vi } from 'vite-plus/test'

const prepareSiteAssets = vi.fn<() => Promise<void>>(async () => {})
const prepareBlogMeta = vi.fn<() => Promise<void>>(async () => {})
const prepareProfile = vi.fn<() => Promise<void>>(async () => {})

vi.mock('rspress-plugin-site-assets', () => ({ prepareSiteAssets }))
vi.mock('rspress-plugin-blog-meta', () => ({ prepareBlogMeta }))
vi.mock('rspress-plugin-profile', () => ({ prepareProfile }))

it('prepareSiteCli runs assets, blog meta, and profile prepare', async () => {
  const { prepareSiteCli } = await import('../scripts/prepare.ts')
  await prepareSiteCli()
  expect(prepareSiteAssets).toHaveBeenCalledWith(
    expect.objectContaining({ siteRoot: expect.any(String) })
  )
  expect(prepareBlogMeta).toHaveBeenCalledWith(
    expect.objectContaining({ siteRoot: expect.any(String), format: true })
  )
  expect(prepareProfile).toHaveBeenCalledWith(
    expect.objectContaining({
      siteRoot: expect.any(String),
      format: true,
      profilePlayModule: '@theme/ProfilePlay'
    })
  )
})
