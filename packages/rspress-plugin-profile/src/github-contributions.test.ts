import { describe, expect, it } from 'vitest'

import { mapContributionCalendar } from './github-contributions.ts'

describe('mapContributionCalendar', () => {
  it('maps GraphQL levels and totals', () => {
    expect(
      mapContributionCalendar(
        {
          user: {
            contributionsCollection: {
              contributionCalendar: {
                totalContributions: 2,
                weeks: [
                  {
                    contributionDays: [
                      {
                        date: '2026-01-01',
                        contributionCount: 0,
                        contributionLevel: 'NONE'
                      },
                      {
                        date: '2026-01-02',
                        contributionCount: 2,
                        contributionLevel: 'SECOND_QUARTILE'
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        'heyq02'
      )
    ).toEqual({
      total: 2,
      href: 'https://github.com/heyq02',
      weeks: [
        [
          { date: '2026-01-01', count: 0, level: 0 },
          { date: '2026-01-02', count: 2, level: 2 }
        ]
      ]
    })
  })

  it('throws when the user is missing', () => {
    expect(() => mapContributionCalendar({ user: null }, 'missing')).toThrow(
      /GitHub user "missing" not found/
    )
  })
})
