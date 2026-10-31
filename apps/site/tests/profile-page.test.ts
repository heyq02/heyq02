import { expect, it } from 'vite-plus/test'

import { profilePage } from '../src/profile-page.ts'

it('builds the Chinese profile page from the overlay', () => {
  const page = profilePage('zh')
  expect(page.degree).toBe('学士')
  expect(page.sections.experience).toBe('经历')
  expect(page.experiences[0]?.company).toBe('京东集团')
  expect(page.experiences[0]?.href).toBe('https://www.jd.com/')
  expect(page.places.at(-1)?.href).toContain('https://heyq02.com')
  expect(page.emptyBlog).toBe('还没有文章。')
  expect(page.projects[0]?.stars).toBe('4.7k')
})

it('builds the English profile page from the English intro', () => {
  const page = profilePage('en')
  expect(page.degree).toBe('Bachelor')
  expect(page.sections.experience).toBe('Experience')
  expect(page.experiences[0]?.company).toBe('JD.com, Inc.')
  expect(page.emptyBlog).toBe('No posts yet.')
  expect(page.skills[0]?.name).toBe('Vue')
})
