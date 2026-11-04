import { expect, it } from 'vite-plus/test'

import { documentTitleSuffix, profilePage, renderHomeMdx } from '../profile-page.ts'

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

it('builds the Chinese profile page from the intro', () => {
  const page = profilePage(pinned)
  expect(page.name).toBe('永琪')
  expect(page.tags).toEqual(['全栈工程师', '开源爱好者', '职业成长博主'])
  expect(page.sections.education).toBe('教育经历')
  expect(page.sections.experience).toBe('工作经历')
  expect(page.sections.openSource).toBe('开源项目')
  expect(page.education[0]?.school).toBe('南京邮电大学')
  expect(page.experiences[0]?.company).toBe('京东集团')
  expect(page.projects[0]?.stars).toBe('172')
  expect(page.projects[0]?.summary).toBe('Showcase your skills')
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
  expect(home).toContain('永琪')
  expect(home).toContain('全栈工程师')
  expect(home).toContain('>教育经历</h2>')
  expect(home).toContain('工学学士')
  expect(home).toContain('生物医学工程')
  expect(home.indexOf('>教育经历</h2>')).toBeLessThan(home.indexOf('>工作经历</h2>'))
  expect(home).not.toContain('profile-bio')
  expect(home).not.toContain('>Education</h2>')
  expect(documentTitleSuffix()).toBe(
    '全栈工程师，开源爱好者，职业成长博主，专注用 AI 加速开发，并真正落到产品里。'
  )
  expect(home).toContain(
    'titleSuffix: "全栈工程师，开源爱好者，职业成长博主，专注用 AI 加速开发，并真正落到产品里。"'
  )
  expect(home).toContain('simpleicons.dev')
  expect(home).toContain('Showcase your skills')
  expect(home).not.toContain('技能图标')
  const projectCard = /<a className=\{?[^>]*profile-project[\s\S]*?<\/a>/.exec(home)?.[0]
  expect(projectCard).toBeTruthy()
  expect(projectCard).toMatchSnapshot('open-source-card.mdx')
})

it('builds title suffix from an empty tags page', () => {
  expect(documentTitleSuffix({ tags: [] })).toBe('专注用 AI 加速开发，并真正落到产品里。')
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
