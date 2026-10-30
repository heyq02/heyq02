import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { brandSlug } from '@heyq02/brands'

import intro from '../../../static/data/intro.json' with { type: 'json' }
import chinese from '../../../static/data/intro.zh.json' with { type: 'json' }

const out = resolve(import.meta.dirname, '../../../README.md')

export function overlayExperiences<
  T extends { company: string; end: string; points: string[] }
>(english: typeof intro.experiences, overlay: readonly T[]) {
  if (overlay.length !== english.length) {
    throw new Error(
      `Chinese experiences (${overlay.length}) must match English (${english.length})`
    )
  }
  return english.map((job, index) => {
    const extra = overlay[index] as T
    return { ...job, company: extra.company, end: extra.end, points: extra.points }
  })
}

function experienceSection(
  heading: string,
  jobs: { company: string; href: string; start: string; end: string; points: string[] }[]
) {
  const experience = jobs
    .map(job => {
      const points = job.points.map(point => `- ${point}`).join('\n')
      return `**[${job.company}](${job.href})** · ${job.start} – ${job.end}\n\n${points}`
    })
    .join('\n\n')
  return `## ${heading}\n\n${experience}`
}

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
  const { alt, base } = skillsPicture()
  const picture = `<picture>
  <source media="(prefers-color-scheme: dark)" srcset="${base}&theme=dark" />
  <img width="100%" alt="${alt}" src="${base}&theme=light" />
</picture>`

  return `<h1>你好，我是 ${intro.name}</h1>

${experienceSection(chinese.sections.experience, overlayExperiences(intro.experiences, chinese.experiences))}

## ${chinese.sections.skills}

${picture}

---

<h1>Hello, I'm ${intro.name}</h1>

${experienceSection(intro.sections.experience, intro.experiences)}
`
}

export async function writeReadme(path = out): Promise<void> {
  await writeFile(path, `${renderReadme().trimEnd()}\n`)
}
