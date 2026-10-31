import { expect, it } from 'vite-plus/test'

import { profilePage, renderHomeMdx } from '../src/profile-page.ts'

it('builds the English profile page from the intro', () => {
  const page = profilePage()
  expect(page.name).toBe('Yongqi He')
  expect(page.degree).toBe('Bachelor')
  expect(page.sections.experience).toBe('Experience')
  expect(page.experiences[0]?.company).toBe('JD.com, Inc.')
  expect(page.projects[0]?.stars).toBe('4.7k')
  expect(page.skills.alt).toContain('Vue')
  expect(page.skills.src).toContain('vuedotjs')
  expect(page.skills.src).toContain('theme=light')

  const home = renderHomeMdx()
  expect(home).toContain('pageType: doc')
  expect(home).not.toContain('pageType: home')
  expect(home).toContain('Callout')
  expect(home).toContain('Steps')
  expect(home).toContain('Badge')
  expect(home).toContain('profile-avatar')
  expect(home).toContain('Yongqi He')
  expect(home).toContain('jd-opensource/taro-ui')
})
