import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { brandSlug } from '@heyq02/brands'
import ejs from 'ejs'

import intro from '../../../static/data/intro.json' with { type: 'json' }

const out = resolve(import.meta.dirname, '../../../README.md')
const templatePath = resolve(import.meta.dirname, 'README.ejs')

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

export async function renderReadme(): Promise<string> {
  const { alt, base } = skillsPicture()
  const template = await readFile(templatePath, 'utf8')
  return ejs.render(template, {
    name: intro.name,
    sections: intro.sections,
    experiences: intro.experiences,
    skillsAlt: alt,
    skillsSrc: `${base}&theme=light`
  })
}

export async function writeReadme(path = out): Promise<void> {
  const markdown = await renderReadme()
  await writeFile(path, `${markdown.trimEnd()}\n`)
}
