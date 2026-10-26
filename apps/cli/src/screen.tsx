import { Box, Text, useApp, useInput, useStdout } from 'ink'
import type { ReactNode } from 'react'

import { fullName, profile } from './profile.ts'

const paper = '#F6F3ED'
const ink = '#343945'
const muted = '#8991A0'
const accent = '#3F6CC4'
const bar = '#EAE1D3'

export function IntroScreen({
  columns,
  rows,
  onExit
}: {
  columns?: number
  rows?: number
  onExit?: () => void
}) {
  const { exit } = useApp()
  const { stdout } = useStdout()
  const stream = stdout as NodeJS.WriteStream | undefined
  const measuredWidth = stream?.columns ?? 0
  const measuredHeight = stream?.rows ?? 0
  const width = columns ?? (measuredWidth > 0 ? measuredWidth : 80)
  const height = rows ?? (measuredHeight > 0 ? measuredHeight : 24)

  useInput(() => {
    onExit?.()
    exit()
  })

  return (
    <Box width={width} height={height} flexDirection='column' backgroundColor={paper}>
      <Box flexGrow={1} flexDirection='column' paddingX={3} paddingTop={1} overflow='hidden'>
        <Text color={ink} bold>
          {`Hello, I'm ${fullName()}`}
        </Text>

        <Section title='Experience'>
          {profile.experiences.map(job => (
            <Box key={job.company} flexDirection='column' marginTop={1}>
              <Text>
                <Text color={ink} bold>
                  {job.company}
                </Text>
                <Text color={muted}>{` · ${job.start} – ${job.end}`}</Text>
              </Text>
              {job.points.map(point => (
                <Text key={point} color={ink}>
                  <Text color={accent}>· </Text>
                  {point}
                </Text>
              ))}
            </Box>
          ))}
        </Section>

        <Section title='Skills'>
          {skillRows(width).map(row => (
            <Text key={row.join('·')}>
              {row.map((name, index) => (
                <Text key={name}>
                  {index > 0 ? <Text color={muted}> · </Text> : null}
                  <Text color={accent}>{name}</Text>
                </Text>
              ))}
            </Text>
          ))}
        </Section>
      </Box>

      <Box paddingX={2} backgroundColor={bar} justifyContent='space-between'>
        <Text color={muted}>{profile.site.replace('https://', '')}</Text>
        <Text color={muted}>any key to exit</Text>
      </Box>
    </Box>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box flexShrink={0} marginTop={1} flexDirection='column'>
      <Text color={accent} bold>
        {title}
      </Text>
      {children}
    </Box>
  )
}

function skillRows(width: number): string[][] {
  const budget = Math.max(24, width - 10)
  const rows: string[][] = [[]]
  let used = 0

  for (const skill of profile.skills) {
    const size = displayWidth(skill.name) + (used > 0 ? 5 : 0)
    const row = rows.at(-1)!
    if (row.length > 0 && used + size > budget) {
      rows.push([skill.name])
      used = displayWidth(skill.name)
    } else {
      row.push(skill.name)
      used += size
    }
  }

  return rows
}

function displayWidth(text: string): number {
  let width = 0
  for (const char of text) {
    width += isWide(char.codePointAt(0) ?? 0) ? 2 : 1
  }
  return width
}

function isWide(code: number): boolean {
  return (
    (code >= 0x11_00 && code <= 0x11_5F) ||
    (code >= 0x2E_80 && code <= 0xA4_CF) ||
    (code >= 0xAC_00 && code <= 0xD7_A3) ||
    (code >= 0xF9_00 && code <= 0xFA_FF) ||
    (code >= 0xFE_10 && code <= 0xFE_19) ||
    (code >= 0xFE_30 && code <= 0xFE_6F) ||
    (code >= 0xFF_00 && code <= 0xFF_60) ||
    (code >= 0xFF_E0 && code <= 0xFF_E6)
  )
}
