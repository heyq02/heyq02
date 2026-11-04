import { sitePanelChrome, TextLink } from '@heyq02/rspress-theme-ui'
import type { ReactElement } from 'react'

import type { ContributionCalendar, ContributionDay, ContributionLevel } from './profile-data.ts'

const LEVEL_CLASS: Record<ContributionLevel, string> = {
  0: 'bg-[#ebedf0] dark:bg-[#161b22]',
  1: 'bg-[#9be9a8] dark:bg-[#0e4429]',
  2: 'bg-[#40c463] dark:bg-[#006d32]',
  3: 'bg-[#30a14e] dark:bg-[#26a641]',
  4: 'bg-[#216e39] dark:bg-[#39d353]'
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

/** GitHub-style contribution calendar with a compact side stats panel. */
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
        className={`${sitePanelChrome} gap-rp-4 px-rp-3 py-rp-2 sm:gap-rp-1 flex w-full shrink-0 items-center sm:w-auto sm:min-w-[11rem] sm:flex-col sm:items-start`}
      >
        <div className='gap-rp-2 flex min-w-0 items-baseline'>
          <TextLink
            href={calendar.href}
            className='text-rp-text hover:text-rp-brand m-0 text-[1.35rem] leading-none font-bold tabular-nums !no-underline'
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
