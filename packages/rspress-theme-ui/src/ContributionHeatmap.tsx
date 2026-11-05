import type {
  ContributionCalendar,
  ContributionDay,
  ContributionLevel
} from '@heyq02/rspress-site-content'
import type { ReactElement } from 'react'

import { TextLink } from './TextLink.tsx'
import { sitePanelChrome } from './tokens.ts'

/** Contribution intensity on Rspress brand / surface tokens. */
const LEVEL_CLASS: Record<ContributionLevel, string> = {
  0: 'bg-[var(--rp-c-bg-mute)]',
  1: 'bg-[var(--rp-c-brand-tint)]',
  2: 'bg-[var(--rp-c-brand-lighter)]',
  3: 'bg-[var(--rp-c-brand-light)]',
  4: 'bg-[var(--rp-c-brand)]'
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
    const day = days[index]
    if (day.count > 0) {
      current += 1
      continue
    }
    // Today with 0 still allows an open streak ending yesterday.
    if (index === days.length - 1) {
      continue
    }
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
    <div className='profile-contributions flex w-full flex-col gap-[calc(var(--rp-radius-small)*1.5)] sm:flex-row sm:items-stretch'>
      <div
        className='flex w-full min-w-0 flex-1'
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
        className={`${sitePanelChrome} flex w-full shrink-0 items-center gap-[var(--rp-radius)] px-[calc(var(--rp-radius-small)*1.5)] py-[var(--rp-radius-small)] sm:w-auto sm:min-w-[11rem] sm:flex-col sm:items-start sm:justify-center sm:gap-[calc(var(--rp-radius-small)/2)]`}
      >
        <div className='flex min-w-0 items-baseline gap-[var(--rp-radius-small)]'>
          <TextLink
            href={calendar.href}
            className='m-0 text-[1.35rem] leading-none font-bold text-[var(--rp-c-text-1)] tabular-nums !no-underline hover:text-[var(--rp-c-brand)]'
          >
            {calendar.total.toLocaleString('zh-CN')}
          </TextLink>
          <span className='text-[0.75rem] whitespace-nowrap text-[var(--rp-c-text-2)]'>
            近一年贡献
          </span>
        </div>
        <p className='m-0 text-[0.75rem] leading-relaxed text-[var(--rp-c-text-2)]'>
          <span className='font-medium text-[var(--rp-c-text-1)] tabular-nums'>{activeDays}</span>{' '}
          活跃
          <span className='mx-[calc(var(--rp-radius-small)/2)] text-[var(--rp-c-divider)]'>·</span>
          <span className='font-medium text-[var(--rp-c-text-1)] tabular-nums'>{longest}</span> 最长
          <span className='mx-[calc(var(--rp-radius-small)/2)] text-[var(--rp-c-divider)]'>·</span>
          <span className='font-medium text-[var(--rp-c-text-1)] tabular-nums'>{current}</span> 当前
        </p>
      </aside>
    </div>
  )
}
