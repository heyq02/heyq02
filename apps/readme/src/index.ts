import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { skillIconsPicture } from '@heyq02/brands'
import ejs from 'ejs'

import intro from '../../../static/data/intro.json' with { type: 'json' }
import { listWritingPosts } from './posts.ts'

const out = resolve(import.meta.dirname, '../../../README.md')
const templatePath = resolve(import.meta.dirname, 'README.ejs')

export function skillsPicture() {
  return skillIconsPicture(intro.skills.map(skill => skill.name))
}

export async function renderReadme(): Promise<string> {
  const { alt, src } = skillsPicture()
  const posts = await listWritingPosts(intro.site)
  const template = await readFile(templatePath, 'utf8')
  return ejs.render(template, {
    name: intro.name,
    tags: intro.tags,
    site: intro.site,
    sections: intro.sections,
    experiences: intro.experiences,
    posts,
    skillsAlt: alt,
    skillsSrc: src
  })
}

export async function writeReadme(path = out): Promise<void> {
  const markdown = await renderReadme()
  await writeFile(path, `${markdown.trimEnd()}\n`)
}
