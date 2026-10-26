import { experiences, fullName, skills } from '@heyq02/profile'

/** Same shape as the profile README: greeting, Experience, Skills. */
export function renderIntro(): string {
  const lines = [`Hello, I'm ${fullName()}`, '', 'Experience', '']

  for (const job of experiences) {
    lines.push(
      `${job.company} · ${job.start} – ${job.end}`,
      ...job.points.map(point => `- ${point}`),
      ''
    )
  }

  lines.push('Skills', '', skills.map(skill => skill.name).join(' · '))

  return lines.join('\n')
}
