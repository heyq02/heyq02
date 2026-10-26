import { fullName, profile } from './profile.ts'

/** Same shape as the profile README: greeting, Experience, Skills. */
export function renderPlain(): string {
  const lines = [`Hello, I'm ${fullName()}`, '', 'Experience', '']

  for (const job of profile.experiences) {
    lines.push(
      `${job.company} · ${job.start} – ${job.end}`,
      ...job.points.map(point => `- ${point}`),
      ''
    )
  }

  lines.push('Skills', '', profile.skills.map(skill => skill.name).join(' · '))

  return lines.join('\n')
}
