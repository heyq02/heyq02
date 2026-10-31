import { expect, test } from '@playwright/test'

test('theme e2e: ProfilePlay poke and FriendsPage grid', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Ari He｜阿瑞' })).toBeVisible()
  const poke = page.getByRole('button', { name: 'Poke the avatar' })
  await poke.click()
  await expect(poke).toHaveClass(/profile-avatar-button--spin/)
  await expect(page.locator('.friends-grid, .friends-empty').first()).toBeVisible()
})
