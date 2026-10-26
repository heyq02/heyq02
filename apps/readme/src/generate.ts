import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { brandSlug } from '@heyq02/brands'

import intro from '../../../static/data/intro.json' with { type: 'json' }

const out = resolve(import.meta.dirname, '../../../README.md')

export function skillsPicture() {
  const named = intro.skills.flatMap(skill => {
    const slug = brandSlug(skill.name)
    return slug ? [{ name: skill.name, slug }] : []
  })
  const icons = named.map(skill => skill.slug).join(',')
  const alt = named.map(skill => skill.name).join(', ')
  const base = `https://simpleicons.dev/icons?icons=${icons}&perline=${Math.max(named.length, 1)}`
  return { alt, base }
}

export function renderReadme(): string {
  const experience = intro.experiences
    .map(job => {
      const points = job.points.map(point => `- ${point}`).join('\n')
      return `**[${job.company}](${job.href})** · ${job.start} – ${job.end}\n\n${points}`
    })
    .join('\n\n')

  const { alt, base } = skillsPicture()

  return `<h1>Hello, I'm ${intro.name}</h1>

## ${intro.sections.experience}

${experience}

## ${intro.sections.skills}

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="${base}&theme=dark" />
  <img width="100%" alt="${alt}" src="${base}&theme=light" />
</picture>
`
}

export async function writeReadme(path = out): Promise<void> {
  await writeFile(path, `${renderReadme().trimEnd()}\n`)
}
