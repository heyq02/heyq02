import { skillIconsPicture } from '@heyq02/brands'
import { formatCount, intro } from '@heyq02/profile'
import type { Intro } from '@heyq02/profile'

export interface ProfilePage {
  name: string
  degree: string
  city: string
  bio: string
  kaomoji: string
  avatar: string
  sections: Intro['sections']
  experiences: Intro['experiences']
  skills: { alt: string; src: string }
  projects: {
    name: string
    href: string
    summary: string
    language: string
    stars: string
    forks: string
  }[]
}

export function profilePage(): ProfilePage {
  return {
    name: intro.name,
    degree: intro.degree,
    city: intro.city,
    bio: intro.bio,
    kaomoji: intro.kaomoji,
    avatar: intro.avatar,
    sections: intro.sections,
    experiences: intro.experiences,
    skills: skillIconsPicture(intro.skills.map(skill => skill.name)),
    projects: intro.projects.map(project => ({
      name: project.name,
      href: project.href,
      summary: project.summary,
      language: project.language,
      stars: formatCount(project.stars),
      forks: formatCount(project.forks)
    }))
  }
}

function yamlString(value: string) {
  return JSON.stringify(value)
}

/** Doc page of Rspress theme components, not the built-in homepage. */
export function renderHomeMdx(): string {
  const page = profilePage()
  const steps = page.experiences
    .map(job => {
      const points = job.points.map(point => `- ${point}`).join('\n')
      return `### [${job.company}](${job.href})\n\n${job.start} – ${job.end}\n\n${points}`
    })
    .join('\n\n')
  const projects = page.projects
    .map(
      project =>
        `### [${project.name}](${project.href})\n\n${project.summary}\n\n<Badge text=${yamlString(project.language)} /> <Badge text=${yamlString(`${project.stars} stars`)} /> <Badge text=${yamlString(`${project.forks} forks`)} />`
    )
    .join('\n\n')

  return `---
pageType: doc
title: ${yamlString(page.name)}
sidebar: false
outline: false
footer: false
---

import { Badge, Callout, Steps } from '@rspress/core/theme'

<img className="profile-avatar" src=${yamlString(page.avatar)} alt="" width="96" height="96" />

# ${page.name}

<Badge text=${yamlString(page.degree)} /> <Badge text=${yamlString(page.city)} />

<Callout type="info">
${page.bio} ${page.kaomoji}
</Callout>

## ${page.sections.experience}

<Steps>

${steps}

</Steps>

## ${page.sections.skills}

![${page.skills.alt}](${page.skills.src})

## ${page.sections.openSource}

${projects}
`
}
