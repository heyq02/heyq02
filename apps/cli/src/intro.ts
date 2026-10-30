import { intro, introZh } from '@heyq02/profile'
import type { Intro } from '@heyq02/profile'

function renderBlock(source: Intro, greeting: string, includeSkills: boolean): string[] {
  const lines = [`${greeting} ${source.name}`, '', source.sections.experience, '']

  for (const job of source.experiences) {
    lines.push(
      `${job.company} · ${job.start} – ${job.end}`,
      ...job.points.map(point => `- ${point}`),
      ''
    )
  }

  if (includeSkills) {
    lines.push(source.sections.skills, '', source.skills.map(skill => skill.name).join(' · '))
  }
  if (lines.at(-1) === '') {
    lines.pop()
  }

  return lines
}

export function renderIntro(): string {
  return [
    ...renderBlock(introZh, '你好，我是', true),
    '',
    ...renderBlock(intro, "Hello, I'm", false)
  ].join('\n')
}
