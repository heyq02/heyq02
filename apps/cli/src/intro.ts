import { intro } from '@heyq02/profile'

export function renderIntro(): string {
  const lines = [`Hello, I'm ${intro.name}`, '', intro.sections.experience, '']

  for (const job of intro.experiences) {
    lines.push(
      `${job.company} · ${job.start} – ${job.end}`,
      ...job.points.map(point => `- ${point}`),
      ''
    )
  }

  lines.push(intro.sections.skills, '', intro.skills.map(skill => skill.name).join(' · '))

  return lines.join('\n')
}
