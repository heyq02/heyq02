import {
  siteCardName,
  siteCardSummary,
  siteDisplay,
  siteH2,
  siteSection,
  siteTile,
  siteWhen
} from '@heyq02/site-ui'
import type { ReactElement } from 'react'

import { likesData } from '../likes-data.ts'
import type { ShelfItem } from '../likes-data.ts'
import { BackLink, ItemLink, PageShell } from './shared.tsx'

/** Desk / toolkit layout: hero device + peripheral strip + app dock. */
export function UsesPage({ ssgMd }: { ssgMd: boolean }): ReactElement {
  const shelf = likesData.uses
  const devices = shelf.sections.find(section => section.id === 'devices')?.items ?? []
  const software = shelf.sections.find(section => section.id === 'software')?.items ?? []
  const primary = devices[0]
  const peripherals = devices.slice(1)

  if (ssgMd) {
    return (
      <PageShell title={shelf.title} intro={shelf.intro} ssgMd tone='likes-uses'>
        <BackLink />
        <h2 className={siteH2}>设备</h2>
        <ul>
          {devices.map(item => (
            <li key={item.title}>
              {item.href ? <a href={item.href}>{item.title}</a> : item.title}
              {item.note ? ` — ${item.note}` : null}
            </li>
          ))}
        </ul>
        <h2 className={siteH2}>软件</h2>
        <ul>
          {software.map(item => (
            <li key={item.title}>
              {item.href ? <a href={item.href}>{item.title}</a> : item.title}
              {item.note ? ` — ${item.note}` : null}
            </li>
          ))}
        </ul>
      </PageShell>
    )
  }

  return (
    <PageShell title={shelf.title} intro={shelf.intro} ssgMd={false} tone='likes-uses'>
      <BackLink />

      <section className={siteSection}>
        <h2 className={siteH2}>工作台</h2>
        <div className='gap-rp-3 grid lg:grid-cols-[1.4fr_1fr]'>
          <DeviceHero item={primary} />
          <ul className='gap-rp-3 m-0 grid list-none p-0'>
            {peripherals.map(item => (
              <li key={item.title} className='m-0'>
                <DeviceRow item={item} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={siteSection}>
        <h2 className={siteH2}>软件坞</h2>
        <ul className='gap-rp-2 m-0 grid list-none grid-cols-2 p-0 sm:grid-cols-4'>
          {software.map(item => (
            <li key={item.title} className='m-0 min-w-0'>
              <ItemLink
                href={item.href}
                className={`group gap-rp-2 px-rp-2 py-rp-4 hover:bg-rp-bg grid h-full justify-items-center text-center ${siteTile}`}
              >
                <span className='rounded-rp-lg border-rp-divider-light bg-rp-bg text-rp-sm text-rp-brand flex size-12 items-center justify-center border font-mono font-semibold tracking-tight'>
                  {item.mark ?? item.title.slice(0, 2)}
                </span>
                <span className='gap-rp-1 grid'>
                  <span className={siteCardName}>{item.title}</span>
                  <span className={siteWhen}>{item.label}</span>
                </span>
              </ItemLink>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  )
}

function DeviceHero({ item }: { item: ShelfItem }): ReactElement {
  return (
    <ItemLink
      href={item.href}
      className={`group p-rp-5 hover:shadow-rp relative grid min-h-[calc(var(--rp-radius-large)*9)] content-between overflow-hidden ${siteTile}`}
    >
      <span className='-right-rp-4 -bottom-rp-6 text-rp-brand absolute font-mono text-[7rem] leading-none opacity-[0.08]'>
        {item.mark ?? 'PC'}
      </span>
      <span className={siteWhen}>{item.label ?? '主力'}</span>
      <span className='gap-rp-2 grid'>
        <span className={siteDisplay}>{item.title}</span>
        <span className={`max-w-lg ${siteCardSummary}`}>{item.note}</span>
      </span>
    </ItemLink>
  )
}

function DeviceRow({ item }: { item: ShelfItem }): ReactElement {
  return (
    <ItemLink
      href={item.href}
      className={`group gap-rp-3 px-rp-3 py-rp-3 hover:bg-rp-bg grid grid-cols-[3rem_1fr] items-center ${siteTile}`}
    >
      <span className='rounded-rp border-rp-divider-light bg-rp-bg text-rp-xs text-rp-muted flex size-12 items-center justify-center border font-mono font-semibold'>
        {item.mark ?? item.title.slice(0, 2)}
      </span>
      <span className='gap-rp-1 grid min-w-0'>
        <span className='gap-rp-2 flex flex-wrap items-baseline justify-between'>
          <span className={siteCardName}>{item.title}</span>
          <span className={siteWhen}>{item.label}</span>
        </span>
        <span className={`line-clamp-2 ${siteCardSummary}`}>{item.note}</span>
      </span>
    </ItemLink>
  )
}
