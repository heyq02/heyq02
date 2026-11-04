import { expect, test } from '@playwright/test'

test.describe('site routes', () => {
  test('home, blog, and friends render in Chinese', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('永琪')
    await expect(page.getByRole('button', { name: '戳一下头像' })).toBeVisible()

    await page.goto('/blog/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('博客')
    await expect(page.locator('body')).toContainText(/文章|面经|macOS/i)

    await page.goto('/friends/')
    await expect(page.getByRole('heading', { name: '友链', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: '交换友链' })).toBeVisible()
    await expect(page.locator('.friends-grid, .friends-empty').first()).toBeVisible()
  })
})

test.describe('single locale', () => {
  test('Chinese is the default locale at unprefixed routes', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh')
    await page.goto('/blog/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh')
  })

  test('blog posts render under /blog/posts/', async ({ page }) => {
    await page.goto('/blog/posts/macos-disable-ime-switching/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh')
    await expect(page.getByRole('heading', { level: 1 }).first()).toContainText('macOS')
  })

  test('there is no language switcher or /zh/ tree', async ({ page }) => {
    await page.goto('/blog/')
    await expect(page.locator('a[href="/zh/blog"]')).toHaveCount(0)
  })
})
