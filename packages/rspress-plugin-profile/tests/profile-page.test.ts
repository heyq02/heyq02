import { expect, it } from 'vite-plus/test'

import {
  documentTitleSuffix,
  profilePage,
  renderHomeMdx,
  sectionsFor
} from '../src/profile-page.ts'

const pinned = [
  {
    name: 'simpleicons.dev',
    href: 'https://github.com/heyq02/simpleicons.dev',
    summary: 'Showcase your skills',
    language: 'TypeScript',
    stars: 172,
    forks: 0
  }
]

it('builds the English profile page from the intro', () => {
  const page = profilePage(pinned)
  expect(page.name).toBe('Ari He｜阿瑞')
  expect(page.tags).toEqual(['Full-stack engineer', 'Open-source enthusiast', 'Blogger on career'])
  expect(page.sections.education).toBe('Education')
  expect(page.sections.experience).toBe('Experience')
  expect(page.sections.openSource).toBe('Open source')
  expect(page.education[0]?.school).toContain('Nanjing')
  expect(page.experiences[0]?.company).toBe('JD.com, Inc.')
  expect(page.projects[0]?.stars).toBe('172')
  expect(page.skills.alt).toContain('Vue')
  expect(page.skills.src).toContain('vuedotjs')
  expect(page.skills.src).toContain('theme=light')

  const home = renderHomeMdx(pinned, { profilePlayModule: '@theme/ProfilePlay' })
  expect(home).toContain('pageType: doc-wide')
  expect(home).not.toContain('pageType: home')
  expect(home).toContain('rp-not-doc')
  expect(home).not.toContain('Callout')
  expect(home).not.toContain('Steps')
  expect(home).toContain('Badge')
  expect(home).toContain("from '@theme/ProfilePlay'")
  expect(home).toContain('ProfilePlay')
  expect(home).toContain('profile-project')
  expect(home).not.toContain('profile-writing')
  expect(home).not.toContain('profile-post')
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
  const projectCard = /<a className=\{?[^>]*profile-project[\s\S]*?<\/a>/.exec(home)?.[0]
  expect(projectCard).toBeTruthy()
  expect(projectCard).toMatchSnapshot('open-source-card.mdx')
})

it('renders Chinese section headings for the zh homepage', () => {
  expect(sectionsFor('zh')).toMatchObject({
    education: '教育经历',
    experience: '工作经历',
    skills: '技能',
    openSource: '开源项目'
  })
  const home = renderHomeMdx(pinned, { lang: 'zh' })
  expect(home).toContain('>教育经历</h2>')
  expect(home).toContain('>工作经历</h2>')
  expect(home).toContain('>开源项目</h2>')
  expect(home).toContain('>技能</h2>')
  expect(home).not.toContain('>Education</h2>')
})

it('builds title suffix from an empty tags page', () => {
  expect(documentTitleSuffix({ tags: [] })).toContain('focused on')
  expect(documentTitleSuffix()).toContain('Full-stack engineer')
})

it('escapes HTML in rendered MDX', () => {
  const home = renderHomeMdx([
    {
      name: 'A & B <C>',
      href: 'https://example.com',
      summary: 'say "hi"',
      language: 'TypeScript',
      stars: 1,
      forks: 0
    }
  ])
  expect(home).toContain('A &amp; B &lt;C&gt;')
  expect(home).toContain('say &quot;hi&quot;')
})
