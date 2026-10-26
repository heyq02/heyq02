import { Box, Text, useApp, useInput, useStdout } from 'ink'
import type { ReactNode } from 'react'

import { formatCount, fullName, profile } from './profile.ts'
import { wordmark } from './wordmark.ts'

const paper = '#F6F3ED'
const ink = '#343945'
const muted = '#8991A0'
const accent = '#3F6CC4'
const card = '#FFFFFF'
const bar = '#EAE1D3'
const gold = '#C08A3E'

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
  const height = rows ?? (measuredHeight > 0 ? measuredHeight : 32)
  const showWordmark = height >= 38 && width >= 64
  const padded = height >= 48 && width >= 80
  const spaced = height >= 30
  const showSummaries = height >= 36
  const showPlaces = height >= 32

  useInput(() => {
    onExit?.()
    exit()
  })

  return (
    <Box width={width} height={height} flexDirection='column' backgroundColor={paper}>
      <Box paddingX={2} justifyContent='space-between'>
        <Text>
          <Text color={accent} bold>
            heyq02
          </Text>
          <Text color={muted}> · profile</Text>
        </Text>
        <Text color={muted}>0.1.0</Text>
      </Box>

      <Box
        flexGrow={1}
        flexShrink={1}
        flexDirection='column'
        overflow='hidden'
        paddingX={3}
        paddingTop={showWordmark ? 1 : 0}
      >
        {showWordmark
          ? wordmark('ARI').map(line => (
              <Text key={line} color={accent}>
                {line}
              </Text>
            ))
          : null}

        <Box flexShrink={0} marginTop={showWordmark ? 1 : 0} flexDirection='column'>
          <Text color={ink} bold>
            {fullName()}
          </Text>
          {sentences(profile.bio).map(line => (
            <Text key={line} color={ink}>
              {line}
            </Text>
          ))}
        </Box>

        <Section title='Experience' padded={padded} spaced={spaced}>
          {profile.experiences.map(job => (
            <Box key={job.company} flexDirection='column'>
              <Text>
                <Text color={ink} bold>
                  {job.company}
                </Text>
                <Text color={muted}>{`  ${job.start} – ${job.end}`}</Text>
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

        <Section title='Skills' padded={padded} spaced={spaced}>
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

        <Section title='Open source' padded={padded} spaced={spaced}>
          {profile.projects.map(project => (
            <Box key={project.name} flexDirection='column'>
              <Text>
                <Text color={ink} bold>
                  {project.name}
                </Text>
                <Text color={gold}>{`  ★ ${formatCount(project.stars)}`}</Text>
                {project.forks > 0 ? (
                  <Text color={muted}>{`  ·  ${formatCount(project.forks)} forks`}</Text>
                ) : null}
              </Text>
              {showSummaries ? <Text color={muted}>{project.summary}</Text> : null}
            </Box>
          ))}
        </Section>

        <Section title='Contact' padded={padded} spaced={spaced}>
          {showPlaces ? (
            <Box flexDirection='column'>
              {profile.places.map(place => (
                <Text key={place.label}>
                  <Text color={muted}>{pad(place.label, 10)}</Text>
                  <Text color={ink}>{place.detail}</Text>
                </Text>
              ))}
              <Text>
                <Text color={muted}>{pad('Phone', 10)}</Text>
                <Text color={ink}>{profile.phone}</Text>
              </Text>
              <Text>
                <Text color={muted}>{pad('Email', 10)}</Text>
                <Text color={ink}>{profile.email}</Text>
              </Text>
            </Box>
          ) : (
            <Box flexDirection='column'>
              {placeRows(width).map(row => (
                <Text key={row} color={ink}>
                  {row}
                </Text>
              ))}
              <Text color={ink}>{`${profile.phone}    ${profile.email}`}</Text>
            </Box>
          )}
        </Section>
      </Box>

      <Box paddingX={2} backgroundColor={bar} justifyContent='space-between'>
        <Text>
          <Text backgroundColor={accent} color={paper}>
            {' heyq02 '}
          </Text>
          <Text color={muted}>{`  ${profile.site.replace('https://', '')}`}</Text>
        </Text>
        <Text color={muted}>any key to exit</Text>
      </Box>
    </Box>
  )
}

function Section({
  title,
  padded,
  spaced,
  children
}: {
  title: string
  padded: boolean
  spaced: boolean
  children: ReactNode
}) {
  return (
    <Box
      flexShrink={0}
      marginTop={spaced ? 1 : 0}
      flexDirection='column'
      backgroundColor={padded ? card : undefined}
      paddingX={padded ? 2 : 0}
      paddingY={padded ? 1 : 0}
    >
      <Text color={accent} bold>
        {title}
      </Text>
      {children}
    </Box>
  )
}

function sentences(text: string): string[] {
  return (text.match(/[^。]+。|[^.]+(?:\.|$)/g) ?? [text])
    .map(part => part.trim())
    .filter(part => part.length > 0)
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

function placeRows(width: number): string[] {
  const budget = Math.max(20, width - 8)
  const items = profile.places.map(place => `${place.label} ${place.detail}`)
  const rows: string[] = []
  let current = ''

  for (const item of items) {
    const next = current.length === 0 ? item : `${current}    ${item}`
    if (current.length > 0 && displayWidth(next) > budget) {
      rows.push(current)
      current = item
    } else {
      current = next
    }
  }

  if (current.length > 0) {
    rows.push(current)
  }

  return rows
}

function pad(text: string, columns: number): string {
  const gap = columns - displayWidth(text)
  return gap > 0 ? `${text}${' '.repeat(gap)}` : text
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
