import { sitePanelChrome, TextLink } from '@heyq02/rspress-theme-ui'
import type { ReactElement } from 'react'

import type { ContributionCalendar, ContributionDay, ContributionLevel } from './profile-data.ts'

/** Ink → amber scale (通州窗台 brand), not stock GitHub green. */
const LEVEL_CLASS: Record<ContributionLevel, string> = {
  0: 'bg-[color-mix(in_oklab,var(--rp-c-text-1)_8%,var(--rp-c-bg))]',
  1: 'bg-[color-mix(in_oklab,var(--rp-c-brand)_28%,var(--rp-c-bg))]',
  2: 'bg-[color-mix(in_oklab,var(--rp-c-brand)_48%,var(--rp-c-bg))]',
  3: 'bg-[color-mix(in_oklab,var(--rp-c-brand)_72%,var(--rp-c-bg))]',
  4: 'bg-rp-brand'
}

function summarize(days: ContributionDay[]) {
  const activeDays = days.filter(day => day.count > 0).length
  let longest = 0
  let current = 0
  let run = 0

  for (const day of days) {
    if (day.count > 0) {
      run += 1
      longest = Math.max(longest, run)
    } else {
      run = 0
    }
  }

  for (let index = days.length - 1; index >= 0; index -= 1) {
    const day = days[index]!
    if (day.count > 0) {
      current += 1
      continue
    }
    // Today with 0 still allows an open streak ending yesterday.
    if (index === days.length - 1) continue
    break
  }

  return { activeDays, longest, current }
}

/** Contribution calendar with a compact side stats panel. */
export function ContributionHeatmap({
  calendar
}: {
  calendar: ContributionCalendar
}): ReactElement {
  const days = calendar.weeks.flat()
  const { activeDays, longest, current } = summarize(days)

  return (
    <div className='profile-contributions gap-rp-3 flex w-full flex-col sm:flex-row sm:items-center'>
      <div
        className='flex min-w-0 w-full flex-1'
        role='img'
        aria-label={`近一年 ${calendar.total} 次 GitHub 贡献`}
      >
        {calendar.weeks.map(week => (
          <div
            key={week[0]?.date ?? week.length}
            className='flex flex-1 flex-col items-center gap-px sm:gap-[2px]'
          >
            {week.map(day => (
              <span
                key={day.date}
                title={`${day.date}: ${day.count} 次贡献`}
                className={`size-[9px] shrink-0 rounded-[2px] sm:size-[10px] ${LEVEL_CLASS[day.level]}`}
              />
            ))}
          </div>
        ))}
      </div>

      <aside
        className={`${sitePanelChrome} flex w-full shrink-0 items-center gap-rp-4 px-rp-3 py-rp-2 sm:w-auto sm:min-w-[11rem] sm:flex-col sm:items-start sm:gap-rp-1`}
      >
        <div className='flex min-w-0 items-baseline gap-rp-2'>
          <TextLink
            href={calendar.href}
            className='m-0 text-[1.35rem] font-bold leading-none text-rp-text tabular-nums !no-underline hover:text-rp-brand'
          >
            {calendar.total.toLocaleString('zh-CN')}
          </TextLink>
          <span className='text-rp-xs text-rp-muted whitespace-nowrap'>近一年贡献</span>
        </div>
        <p className='text-rp-xs text-rp-muted m-0 leading-relaxed'>
          <span className='text-rp-text font-medium tabular-nums'>{activeDays}</span> 活跃
          <span className='mx-rp-1 text-rp-divider'>·</span>
          <span className='text-rp-text font-medium tabular-nums'>{longest}</span> 最长
          <span className='mx-rp-1 text-rp-divider'>·</span>
          <span className='text-rp-text font-medium tabular-nums'>{current}</span> 当前
        </p>
      </aside>
    </div>
  )
}
