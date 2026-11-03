import { expect, test } from '@playwright/test'
import type { Locator } from '@playwright/test'

import { normalizeDomSnapshot } from '../../../e2e/dom-snapshot.ts'

async function assertCardChrome(locator: Locator) {
  await expect(locator).toBeVisible()
  await expect(locator).toHaveCSS('border-style', 'solid')
  const padding = await locator.evaluate(el => getComputedStyle(el).padding)
  expect(padding).not.toBe('0px')
  const background = await locator.evaluate(el => getComputedStyle(el).backgroundColor)
  expect(background).not.toBe('rgba(0, 0, 0, 0)')
  const radius = await locator.evaluate(el => getComputedStyle(el).borderRadius)
  expect(radius).not.toBe('0px')
}

async function cardDomSnapshot(locator: Locator) {
  return normalizeDomSnapshot(await locator.evaluate(el => el.outerHTML))
}

test.describe('site routes', () => {
  test('home, blog, and friends render in Chinese', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Ari')
    await expect(page.getByRole('button', { name: '戳一下头像' })).toBeVisible()

    await page.goto('/blog/')
    await expect(page.locator('body')).toContainText(/概览|文章|macOS/i)

    await page.goto('/friends/')
    await expect(page.getByRole('heading', { name: '友链', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: '交换友链' })).toBeVisible()
    await expect(page.locator('.friends-grid, .friends-empty').first()).toBeVisible()
  })

  test('open-source and friends cards match DOM snapshots', async ({ page }) => {
    await page.goto('/')
    const project = page.locator('a.profile-project').first()
    await assertCardChrome(project)
    expect(await cardDomSnapshot(project)).toMatchSnapshot('open-source-card.txt')

    await page.goto('/friends/')
    const friend = page.locator('a[data-card]').filter({ hasText: 'DIYgod' }).first()
    await assertCardChrome(friend)
    expect(await cardDomSnapshot(friend)).toMatchSnapshot('friend-card-diygod.txt')
  })
})

test.describe('single locale', () => {
  test('Chinese is the default locale at unprefixed routes', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh')
    await page.goto('/blog/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('博客')
  })

  test('blog posts render under /blog/posts/', async ({ page }) => {
    await page.goto('/blog/posts/macos-disable-ime-switching/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('macOS')
  })

  test('there is no language switcher or /zh/ tree', async ({ page }) => {
    await page.goto('/blog/')
    await expect(page.locator('a[href="/zh/blog"]')).toHaveCount(0)
    await expect(page.locator('[class*="language"]')).toHaveCount(0)
  })
})
