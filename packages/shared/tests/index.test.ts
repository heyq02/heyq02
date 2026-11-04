import { expect, it } from 'vite-plus/test'

import { formatCount, intro, skillIconsPicture, socialLinksFrom } from '../src/index.ts'

it('loads the Chinese intro SSOT', () => {
  expect(intro.name).toBe('永琪')
  expect(intro.title).toBe(intro.name)
  expect(intro.description.startsWith(`${intro.name}。`)).toBe(true)
  expect(intro.moods[0]).toBe(intro.kaomoji)
  expect(intro.contact.email).toContain('@')
})

it('keeps identity copy in Chinese', () => {
  expect(intro.tags).toEqual(['全栈工程师', '开源爱好者', '职业成长博主'])
  expect(intro.sections).toEqual({
    experience: '工作经历',
    skills: '技能',
    openSource: '开源项目',
    education: '教育经历'
  })
  expect(intro.experiences[0]?.company).toBe('京东集团')
  expect(intro.experiences[0]?.end).toBe('至今')
  expect(intro.education[0]?.school).toBe('南京邮电大学')
  expect(intro.places.find(place => place.label === 'WeChat')?.detail).toBe('扫码添加')
})

it('no longer carries a parallel project summary table', () => {
  // Project copy comes straight from GitHub; intro must not shadow it.
  expect(intro).not.toHaveProperty('projectSummaries')
})

it('formats counts under and over one thousand', () => {
  expect(formatCount(0)).toBe('0')
  expect(formatCount(999)).toBe('999')
  expect(formatCount(1000)).toBe('1k')
  expect(formatCount(1500)).toBe('1.5k')
  expect(formatCount(4730)).toBe('4.7k')
})

it('builds the shared skills picture URL from icon slugs', () => {
  const picture = skillIconsPicture([
    { name: 'Vue', icon: 'vuedotjs' },
    { name: 'Taro', icon: '' },
    { name: 'Docker', icon: 'docker' }
  ])
  expect(picture.alt).toBe('Vue, Docker')
  expect(picture.src).toContain('icons=vuedotjs,docker')
  expect(picture.src).toContain('perline=2')
  expect(picture.src).toContain('theme=light')
  expect(skillIconsPicture([]).src).toContain('perline=1')
})

it('exposes the social navbar mapping from intro places', () => {
  const links = socialLinksFrom(intro.places)
  expect(links.map(link => link.icon)).toEqual(['github', 'x', 'bilibili', 'wechat'])
})
