import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import intro from '../../../static/data/intro.json' with { type: 'json' }
import { skillSlug } from './slugs.ts'

const root = resolve(import.meta.dirname, '../../..')
const out = resolve(root, 'README.md')

function renderExperience(): string {
  const blocks = intro.experiences.map(job => {
    const points = job.points.map(point => `- ${point}`).join('\n')
    return `**[${job.company}](${job.href})** · ${job.start} – ${job.end}\n\n${points}`
  })
  return [`## ${intro.sections.experience}`, '', ...blocks].join('\n')
}

function renderSkills(): string {
  const named = intro.skills
    .map(skill => {
      const slug = skillSlug(skill.name)
      return slug ? { name: skill.name, slug } : undefined
    })
    .filter((entry): entry is { name: string; slug: string } => entry !== undefined)

  const icons = named.map(skill => skill.slug).join(',')
  const alt = named.map(skill => skill.name).join(', ')
  const perline = Math.max(named.length, 1)
  const base = `https://simpleicons.dev/icons?icons=${icons}&perline=${perline}`

  return [
    `## ${intro.sections.skills}`,
    '',
    '<picture>',
    `  <source media="(prefers-color-scheme: dark)" srcset="${base}&theme=dark" />`,
    `  <img width="100%" alt="${alt}" src="${base}&theme=light" />`,
    '</picture>'
  ].join('\n')
}

export function renderReadme(): string {
  return [`<h1>Hello, I'm ${intro.name}</h1>`, '', renderExperience(), '', renderSkills(), ''].join(
    '\n'
  )
}

writeFileSync(out, renderReadme())
