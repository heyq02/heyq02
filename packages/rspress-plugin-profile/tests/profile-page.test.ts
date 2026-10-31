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
  expect(page.name).toBe('Ari He｜阿瑞')
  expect(page.tags).toEqual(['Full-stack engineer', 'Open-source enthusiast', 'Blogger on career'])
  expect(page.sections.education).toBe('Education')
  expect(page.sections.experience).toBe('Experience')
  expect(page.sections.writing).toBe('Writing')
  expect(page.education[0]?.school).toContain('Nanjing')
  expect(page.experiences[0]?.company).toBe('JD.com, Inc.')
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
    ],
    { profilePlayModule: '@theme/ProfilePlay' }
  )
  expect(home).toContain('pageType: doc-wide')
  expect(home).not.toContain('pageType: home')
  expect(home).toContain('rp-not-doc')
  expect(home).not.toContain('Callout')
  expect(home).not.toContain('Steps')
  expect(home).toContain('Badge')
  expect(home).toContain("from '@theme/ProfilePlay'")
  expect(home).toContain('ProfilePlay')
  expect(home).toContain('profile-project')
  expect(home).toContain('profile-writing')
  expect(home).toContain('profile-post')
  expect(home).toContain('Demo post')
  expect(home).not.toContain('quiet shelf')
  expect(home).toContain('Ari He｜阿瑞')
  expect(home).not.toContain('Yongqi He')
  expect(home).not.toContain('阿瑞oxo')
  expect(home).toContain('Full-stack engineer')
  expect(home).toContain('>Education</h2>')
  expect(home).toContain('Bachelor of Engineering')
  expect(home).toContain('Biomedical Engineering')
  expect(home.indexOf('>Education</h2>')).toBeLessThan(home.indexOf('>Experience</h2>'))
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

it('renders the quiet-shelf placeholder when there are no posts', () => {
  const home = renderHomeMdx()
  expect(home).toContain('quiet shelf')
  expect(home).toContain('@theme/ProfilePlay')
})

it('omits post date and summary when blank', () => {
  const home = renderHomeMdx([
    { slug: 'x', href: '/blog/posts/x/', title: 'Bare', description: '', date: '' }
  ])
  expect(home).toContain('Bare')
  expect(home).not.toContain('profile-post-summary')
  expect(home).not.toContain('dateTime=')
})

it('builds title suffix from an empty tags page', () => {
  expect(documentTitleSuffix({ tags: [] })).toContain('focused on')
  expect(documentTitleSuffix()).toContain('Full-stack engineer')
})

it('escapes HTML in rendered MDX', () => {
  const home = renderHomeMdx([
    {
      slug: 'x',
      href: '/blog/posts/x/',
      title: 'A & B <C>',
      description: 'say "hi"',
      date: '2026-01-01'
    }
  ])
  expect(home).toContain('A &amp; B &lt;C&gt;')
  expect(home).toContain('say &quot;hi&quot;')
})
