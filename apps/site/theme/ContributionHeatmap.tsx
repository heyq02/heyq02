import { TextLink } from '@heyq02/rspress-theme-ui'
import type { ReactElement } from 'react'

import type { ContributionCalendar, ContributionLevel } from './profile-data.ts'

const LEVEL_CLASS: Record<ContributionLevel, string> = {
  0: 'bg-[#ebedf0] dark:bg-[#161b22]',
  1: 'bg-[#9be9a8] dark:bg-[#0e4429]',
  2: 'bg-[#40c463] dark:bg-[#006d32]',
  3: 'bg-[#30a14e] dark:bg-[#26a641]',
  4: 'bg-[#216e39] dark:bg-[#39d353]'
}

/** GitHub-style contribution calendar for the homepage. */
export function ContributionHeatmap({
  calendar
}: {
  calendar: ContributionCalendar
}): ReactElement {
  return (
    <div className='profile-contributions gap-rp-3 grid'>
      <p className='text-rp-md text-rp-muted m-0'>
        近一年{' '}
        <TextLink href={calendar.href} className='text-rp-text font-semibold'>
          {calendar.total.toLocaleString('zh-CN')}
        </TextLink>{' '}
        次贡献
      </p>

      <div className='overflow-x-auto'>
        <div
          className='inline-flex gap-[3px]'
          role='img'
          aria-label={`近一年 ${calendar.total} 次 GitHub 贡献`}
        >
          {calendar.weeks.map(week => (
            <div key={week[0]?.date ?? week.length} className='flex flex-col gap-[3px]'>
              {week.map(day => (
                <span
                  key={day.date}
                  title={`${day.date}: ${day.count} 次贡献`}
                  className={`size-[10px] rounded-sm ${LEVEL_CLASS[day.level]}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
