import { expect, it } from 'vite-plus/test'

import { profilePage } from '../src/profile-page.ts'
import { socialLinks, socialLinksFrom } from '../src/social-links.ts'

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

it('puts contact links in the navbar social list', () => {
  const links = socialLinks()
  expect(links.find(link => link.icon === 'github')).toMatchObject({
    mode: 'link',
    content: 'https://github.com/heyq02'
  })
  expect(links.find(link => link.icon === 'wechat')).toMatchObject({
    mode: 'img',
    content: '/wechat.jpg'
  })
  expect(links.some(link => link.content === 'mailto:hello@heyq02.com')).toBe(true)
  expect(links.some(link => link.mode === 'text' && link.content.includes('135'))).toBe(true)
  expect(
    socialLinksFrom([{ label: 'Unknown', href: 'https://example.com', detail: 'x' }]).some(
      link => link.content === 'https://example.com'
    )
  ).toBe(false)
})
