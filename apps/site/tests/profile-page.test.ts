import { expect, it } from 'vite-plus/test'

import { profilePage, renderHomeMdx } from '../src/profile-page.ts'

it('builds the English profile page from the intro', () => {
  const page = profilePage()
  expect(page.name).toBe('Yongqi He')
  expect(page.tags).toEqual(['Full-stack engineer', 'Open-source enthusiast', 'Blogger on career'])
  expect(page.sections.experience).toBe('Experience')
  expect(page.experiences[0]?.company).toBe('JD.com, Inc.')
  expect(page.projects[0]?.stars).toBe('4.7k')
  expect(page.skills.alt).toContain('Vue')
  expect(page.skills.src).toContain('vuedotjs')
  expect(page.skills.src).toContain('theme=light')

  const home = renderHomeMdx([
    {
      slug: 'demo',
      href: '/blog/demo/',
      title: 'Demo post',
      description: 'A short note',
      date: '2026-10-31'
    }
  ])
  expect(home).toContain('pageType: doc')
  expect(home).not.toContain('pageType: home')
  expect(home).toContain('rp-not-doc')
  expect(home).not.toContain('Callout')
  expect(home).not.toContain('Steps')
  expect(home).toContain('Badge')
  expect(home).toContain('profile-hero')
  expect(home).toContain('profile-avatar')
  expect(home).toContain('profile-project')
  expect(home).toContain('profile-writing')
  expect(home).toContain('profile-post')
  expect(home).toContain('Demo post')
  expect(home).not.toContain('quiet shelf')
  expect(home).toContain('Yongqi He')
  expect(home).toContain('Full-stack engineer')
  expect(home).not.toContain('Bachelor')
  expect(home).not.toContain('profile-bio')
  expect(home).not.toContain('Focused on AI')
  expect(home).toContain('jd-opensource/taro-ui')
})
