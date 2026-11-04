import type { ReactElement } from 'react'

import { siteCardName, siteCardSummary, siteH2, siteSection, siteWhen } from '../../lib/site-ui.ts'
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
        <div className='grid gap-3 lg:grid-cols-[1.4fr_1fr]'>
          <DeviceHero item={primary} />
          <ul className='m-0 grid list-none gap-3 p-0'>
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
        <ul className='m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-4'>
          {software.map(item => (
            <li key={item.title} className='m-0 min-w-0'>
              <ItemLink
                href={item.href}
                className='group grid h-full justify-items-center gap-2 rounded-[var(--rp-radius-small)] border border-[var(--rp-c-divider-light)] bg-[var(--rp-c-bg-soft)] px-2 py-4 text-center no-underline transition-[border-color,background-color,transform] duration-200 hover:border-[var(--rp-c-brand)] hover:bg-[var(--rp-c-bg)] hover:!no-underline'
              >
                <span className='flex size-12 items-center justify-center rounded-2xl border border-[var(--rp-c-divider-light)] bg-[var(--rp-c-bg)] font-[family-name:var(--rp-font-family-mono)] text-sm font-semibold tracking-tight text-[var(--rp-c-brand)]'>
                  {item.mark ?? item.title.slice(0, 2)}
                </span>
                <span className='grid gap-1'>
                  <span className={`text-[0.95rem] ${siteCardName}`}>{item.title}</span>
                  <span className={siteWhen}>{item.label}</span>
                </span>
              </ItemLink>
            </li>
          ))}
        </ul>
        <p className={`mt-3 ${siteCardSummary}`}>
          点开图标看备注；听歌客户端只作入口，完整榜单在「听歌」。
        </p>
      </section>
    </PageShell>
  )
}

function DeviceHero({ item }: { item: ShelfItem }): ReactElement {
  return (
    <ItemLink
      href={item.href}
      className='group relative grid min-h-[14rem] content-between overflow-hidden rounded-[var(--rp-radius-small)] border border-[var(--rp-c-divider-light)] bg-[var(--rp-c-bg-soft)] p-5 no-underline transition-[border-color,box-shadow] duration-200 hover:border-[var(--rp-c-brand)] hover:!no-underline hover:shadow-[var(--rp-shadow-1)]'
    >
      <span className='absolute -right-4 -bottom-6 font-[family-name:var(--rp-font-family-mono)] text-[7rem] leading-none text-[var(--rp-c-brand)] opacity-[0.08]'>
        {item.mark ?? 'PC'}
      </span>
      <span className={siteWhen}>{item.label ?? '主力'}</span>
      <span className='grid gap-2'>
        <span className='text-[clamp(1.4rem,3vw,1.85rem)] font-bold tracking-[-0.02em] text-[var(--rp-c-text-1)]'>
          {item.title}
        </span>
        <span className={`max-w-[28rem] ${siteCardSummary}`}>{item.note}</span>
      </span>
    </ItemLink>
  )
}

function DeviceRow({ item }: { item: ShelfItem }): ReactElement {
  return (
    <ItemLink
      href={item.href}
      className='group grid grid-cols-[3rem_1fr] items-center gap-3 rounded-[var(--rp-radius-small)] border border-[var(--rp-c-divider-light)] bg-[var(--rp-c-bg-soft)] px-3 py-3 no-underline transition-[border-color,background-color] duration-200 hover:border-[var(--rp-c-brand)] hover:bg-[var(--rp-c-bg)] hover:!no-underline'
    >
      <span className='flex size-12 items-center justify-center rounded-xl border border-[var(--rp-c-divider-light)] bg-[var(--rp-c-bg)] font-[family-name:var(--rp-font-family-mono)] text-xs font-semibold text-[var(--rp-c-text-2)]'>
        {item.mark ?? item.title.slice(0, 2)}
      </span>
      <span className='grid min-w-0 gap-0.5'>
        <span className='flex flex-wrap items-baseline justify-between gap-2'>
          <span className={siteCardName}>{item.title}</span>
          <span className={siteWhen}>{item.label}</span>
        </span>
        <span className={`line-clamp-2 ${siteCardSummary}`}>{item.note}</span>
      </span>
    </ItemLink>
  )
}
