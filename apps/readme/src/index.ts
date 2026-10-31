import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { skillIconsPicture } from '@heyq02/brands'
import ejs from 'ejs'

import intro from '../../../static/data/intro.json' with { type: 'json' }

const out = resolve(import.meta.dirname, '../../../README.md')
const templatePath = resolve(import.meta.dirname, 'README.ejs')

export function skillsPicture() {
  const { alt, src } = skillIconsPicture(intro.skills.map(skill => skill.name))
  return { alt, base: src.replace(/&theme=light$/, '') }
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
