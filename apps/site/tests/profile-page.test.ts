import { expect, it } from 'vite-plus/test'

import { profilePage } from '../src/profile-page.ts'

it('builds the English profile page from the intro', () => {
  const page = profilePage()
  expect(page.name).toBe('Yongqi He')
  expect(page.degree).toBe('Bachelor')
  expect(page.sections.experience).toBe('Experience')
  expect(page.experiences[0]?.company).toBe('JD.com, Inc.')
  expect(page.places.at(-1)?.href).toContain('https://heyq02.com')
  expect(page.emptyBlog).toBe('No posts yet.')
  expect(page.projects[0]?.stars).toBe('4.7k')
  expect(page.skills[0]?.name).toBe('Vue')
})
