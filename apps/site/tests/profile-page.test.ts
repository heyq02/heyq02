import { expect, it } from 'vite-plus/test'

import { documentTitleSuffix, profilePage, renderHomeMdx } from '../src/profile-page.ts'

it('builds the English profile page from the intro', () => {
  const page = profilePage([
    {
      name: 'simpleicons.dev',
      href: 'https://github.com/heyq02/simpleicons.dev',
      summary: 'Showcase your skills',
      language: 'TypeScript',
      stars: 172,
      forks: 0
    }
  ])
  expect(page.name).toBe('Yongqi He')
  expect(page.kicker).toBe('Profile')
  expect(page.tags).toEqual(['Full-stack engineer', 'Open-source enthusiast', 'Blogger on career'])
  expect(page.sections.education).toBe('Education')
  expect(page.sections.experience).toBe('Experience')
  expect(page.sections.writing).toBe('Writing')
  expect(page.education[0]?.school).toContain('Nanjing')
  expect(page.experiences[0]?.company).toBe('JD.com, Inc.')
  expect(page.experiences[0]?.logo).toContain('360buyimg.com')
  expect(page.projects[0]?.stars).toBe('172')
  expect(page.skills.alt).toContain('Vue')
  expect(page.skills.src).toContain('vuedotjs')
  expect(page.skills.src).toContain('theme=light')

  const home = renderHomeMdx(
    [
      {
        slug: 'demo',
        href: '/blog/demo/',
        title: 'Demo post',
        description: 'A short note',
        date: '2026-10-31'
      }
    ],
    [
      {
        name: 'simpleicons.dev',
        href: 'https://github.com/heyq02/simpleicons.dev',
        summary: 'Showcase your skills',
        language: 'TypeScript',
        stars: 172,
        forks: 0
      }
    ]
  )
  expect(home).toContain('pageType: doc')
  expect(home).not.toContain('pageType: home')
  expect(home).toContain('rp-not-doc')
  expect(home).not.toContain('Callout')
  expect(home).not.toContain('Steps')
  expect(home).toContain('Badge')
  expect(home).toContain('profile-hero')
  expect(home).toContain('profile-avatar')
  expect(home).toContain('alt="Yongqi He"')
  expect(home).toContain('profile-project')
  expect(home).toContain('profile-writing')
  expect(home).toContain('profile-post')
  expect(home).toContain('Demo post')
  expect(home).not.toContain('quiet shelf')
  expect(home).toContain('Yongqi He')
  expect(home).toContain('Full-stack engineer')
  expect(home).toContain('>Education</h2>')
  expect(home).toContain('Bachelor of Engineering')
  expect(home).toContain('Biomedical Engineering')
  expect(home.indexOf('>Education</h2>')).toBeLessThan(home.indexOf('>Experience</h2>'))
  expect(home).toContain('profile-job-logo')
  expect(home).toContain('360buyimg.com')
  expect(home).not.toContain('profile-bio')
  expect(documentTitleSuffix()).toBe(
    'Full-stack engineer, focused on AI that speeds up development and ships in real products.'
  )
  expect(home).toContain(
    'titleSuffix: "Full-stack engineer, focused on AI that speeds up development and ships in real products."'
  )
  expect(home).toContain('simpleicons.dev')
  expect(home).toContain('Showcase your skills')
  expect(home).toContain('>Writing</h2>')
})
