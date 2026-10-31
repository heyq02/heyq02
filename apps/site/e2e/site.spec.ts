import { expect, test } from '@playwright/test'
import type { Locator } from '@playwright/test'

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
    expect(await project.evaluate(el => el.outerHTML)).toMatchSnapshot('open-source-card.html')

    await page.goto('/friends/')
    const friend = page.locator('a[data-card]').filter({ hasText: 'DIYgod' }).first()
    await assertCardChrome(friend)
    expect(await friend.evaluate(el => el.outerHTML)).toMatchSnapshot('friend-card-diygod.html')
  })
})
