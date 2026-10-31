import { expect, test } from '@playwright/test'
import type { Locator } from '@playwright/test'

async function assertCardChrome(locator: Locator) {
  await expect(locator).toBeVisible()
  // Soft panel tokens from siteCardChrome (lost when Tailwind missed @source shared).
  await expect(locator).toHaveCSS('border-style', 'solid')
  const padding = await locator.evaluate(el => getComputedStyle(el).padding)
  expect(padding).not.toBe('0px')
  const background = await locator.evaluate(el => getComputedStyle(el).backgroundColor)
  expect(background).not.toBe('rgba(0, 0, 0, 0)')
  const radius = await locator.evaluate(el => getComputedStyle(el).borderRadius)
  expect(radius).not.toBe('0px')
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

  test('open-source and friends cards keep soft chrome', async ({ page }) => {
    await page.goto('/')
    const project = page.locator('a.profile-project').first()
    await assertCardChrome(project)
    await expect(project).toHaveScreenshot('open-source-card.png', {
      animations: 'disabled'
    })

    await page.goto('/friends/')
    await assertCardChrome(page.locator('a[data-card]').filter({ hasText: 'DIYgod' }).first())
  })
})
