import { expect, test } from '@playwright/test'

test('site e2e: home, blog, and friends routes render', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ari')
  await expect(page.getByRole('button', { name: 'Poke the avatar' })).toBeVisible()

  await page.goto('/blog/')
  await expect(page.locator('body')).toContainText(/Overview|Posts|macOS/i)

  await page.goto('/friends/')
  await expect(page.getByText(/Friends|友情|links/i).first()).toBeVisible()
})
