import { expect, it } from 'vite-plus/test'

import { skillIconsPicture } from '../src/index.ts'

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
