import { expect, it } from 'vite-plus/test'

import {
  siteCardChrome,
  siteCardName,
  siteH1,
  siteH2,
  siteLink,
  sitePanelChrome
} from '../ui-classes.ts'

it('exposes stable shared surface tokens', () => {
  expect(siteH1).toContain('clamp(2.1rem')
  expect(siteH2).toContain('after:bg-[var(--rp-c-brand)]')
  expect(siteLink).toContain('hover:underline-offset-[3px]')
  expect(sitePanelChrome).toContain('px-[1.05rem]')
  expect(siteCardChrome.startsWith(sitePanelChrome)).toBe(true)
  expect(siteCardName).toContain('1.02rem')
})
