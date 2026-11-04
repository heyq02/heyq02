import { basename } from 'node:path'

import { expect, it } from 'vite-plus/test'

import { pluginWatermark, watermarkComponentPath } from '../src/index.ts'

it('requires a watermark image src', () => {
  expect(() => pluginWatermark({ src: '' })).toThrow(/src/)
})

it('registers the watermark as a global UI component', () => {
  const plugin = pluginWatermark({ src: '/wuxian-jinbu.png' })
  expect(plugin.name).toBe('@heyq02/rspress-plugin-watermark')
  expect(plugin.globalUIComponents).toEqual([
    [watermarkComponentPath(), { src: '/wuxian-jinbu.png' }]
  ])
  expect(basename(watermarkComponentPath())).toBe('Watermark.tsx')
})
