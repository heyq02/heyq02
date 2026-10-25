import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { brandSlug } from '@heyq02/brands'
import { intro, skills } from '@heyq02/profile'
import { Eta } from 'eta'

const root = resolve(import.meta.dirname, '../../..')
const out = resolve(root, 'README.md')
const templates = resolve(import.meta.dirname, '../templates')

// Markdown output: keep `&` / newlines; do not HTML-escape.
const eta = new Eta({ views: templates, autoEscape: false, autoTrim: false })

function skillsPicture() {
  const named = skills
    .map(skill => {
      const slug = brandSlug(skill.name)
      return slug ? { name: skill.name, slug } : undefined
    })
    .filter((entry): entry is { name: string; slug: string } => entry !== undefined)

  const icons = named.map(skill => skill.slug).join(',')
  const alt = named.map(skill => skill.name).join(', ')
  const perline = Math.max(named.length, 1)
  const base = `https://simpleicons.dev/icons?icons=${icons}&perline=${perline}`

  return { alt, base }
}

export function renderReadme(): string {
  return eta.render('./readme', {
    name: intro.name,
    sections: intro.sections,
    experiences: intro.experiences,
    skills: skillsPicture()
  })
}

// Collapse template loop whitespace so output matches oxfmt (avoids empty CI commits).
const markdown = renderReadme()
  .replaceAll(/\n{3,}/g, '\n\n')
  .trimEnd()
writeFileSync(out, `${markdown}\n`)
