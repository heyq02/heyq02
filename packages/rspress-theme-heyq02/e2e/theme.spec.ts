import { expect, test } from '@playwright/test'

test('theme e2e: ProfilePlay poke and FriendsPage card DOM', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Ari He｜阿瑞' })).toBeVisible()
  const poke = page.getByRole('button', { name: 'Poke the avatar' })
  await poke.click()
  await expect(poke).toHaveClass(/profile-avatar-button--spin/)

  const friend = page.locator('a[data-card]').filter({ hasText: 'DIYgod' }).first()
  await expect(friend).toBeVisible()
  await expect(friend).toHaveCSS('border-style', 'solid')
  const padding = await friend.evaluate(el => getComputedStyle(el).padding)
  expect(padding).not.toBe('0px')
  expect(await friend.evaluate(el => el.outerHTML)).toMatchSnapshot('theme-friend-card-diygod.html')
})
