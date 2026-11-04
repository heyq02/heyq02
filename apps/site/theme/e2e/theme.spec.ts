import { expect, test } from '@playwright/test'

import { normalizeDomSnapshot } from '../../../../e2e/dom-snapshot.ts'

test('theme e2e: ProfilePlay poke and FriendsPage card DOM', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: '永琪' })).toBeVisible()
  const poke = page.getByRole('button', { name: '戳一下头像' })
  await poke.click()
  await expect(poke).toHaveClass(/profile-avatar-button--spin/)

  const friend = page.locator('a[data-card]').filter({ hasText: 'DIYgod' }).first()
  await expect(friend).toBeVisible()
  await expect(friend).toHaveCSS('border-style', 'solid')
  const padding = await friend.evaluate(el => getComputedStyle(el).padding)
  expect(padding).not.toBe('0px')
  expect(normalizeDomSnapshot(await friend.evaluate(el => el.outerHTML))).toMatchSnapshot(
    'theme-friend-card-diygod.txt'
  )
})
