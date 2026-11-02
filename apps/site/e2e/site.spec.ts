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
  test('home, blog, and friends render', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Ari')
    await expect(page.getByRole('button', { name: 'Poke the avatar' })).toBeVisible()

    await page.goto('/blog/')
    await expect(page.locator('body')).toContainText(/Overview|Posts|macOS/i)

    await page.goto('/friends/')
    await expect(page.getByRole('heading', { name: 'Friends' })).toBeVisible()
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

test.describe('blog i18n', () => {
  test('English is the default locale at unprefixed routes', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await page.goto('/blog/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })

  test('Chinese blog lives under /zh/', async ({ page }) => {
    await page.goto('/zh/blog/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('博客')
    await page.goto('/zh/blog/posts/macos-disable-ime-switching/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('macOS')
  })

  test('the navbar language switcher links both locales', async ({ page }) => {
    // Hover menus are flaky in headless Chromium; assert the rendered links instead.
    await page.goto('/blog/')
    const toChinese = page.locator('a[href="/zh/blog"][lang="zh"]').first()
    await expect(toChinese).toHaveAttribute('aria-label', '简体中文')

    await page.goto('/zh/blog/')
    const toEnglish = page.locator('a[href="/blog"][lang="en"]').first()
    await expect(toEnglish).toHaveAttribute('aria-label', 'English')
  })
})
