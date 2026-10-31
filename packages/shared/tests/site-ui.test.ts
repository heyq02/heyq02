import { expect, it } from 'vite-plus/test'

import { siteCardChrome, siteH1, siteH2, sitePanelChrome, siteWhen } from '../src/site-ui.ts'

it('exposes stable shared surface tokens', () => {
  expect(siteH1).toContain('clamp(2.1rem')
  expect(siteH2).toContain('after:bg-[var(--rp-c-brand)]')
  expect(sitePanelChrome).toContain('px-[1.05rem]')
  expect(siteCardChrome.startsWith(sitePanelChrome)).toBe(true)
  expect(siteWhen).toContain('font-family-mono')
})
