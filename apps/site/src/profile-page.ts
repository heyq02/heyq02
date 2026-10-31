import { skillIconsPicture } from '@heyq02/brands'
import { formatCount, intro } from '@heyq02/profile'
import type { Intro } from '@heyq02/profile'

import type { BlogPost } from './blog-posts.ts'
import type { PinnedProject } from './github-pinned.ts'

export interface ProfilePage {
  name: string
  kicker: string
  tags: string[]
  avatar: string
  sections: Intro['sections']
  education: Intro['education']
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

export function profilePage(projects: PinnedProject[] = []): ProfilePage {
  return {
    name: intro.name,
    kicker: intro.kicker,
    tags: intro.tags,
    avatar: intro.avatar,
    sections: intro.sections,
    education: intro.education,
    experiences: intro.experiences,
    skills: skillIconsPicture(intro.skills),
    projects: projects.map(project => ({
      name: project.name,
      href: project.href,
      summary: project.summary,
      language: project.language,
      stars: formatCount(project.stars),
      forks: formatCount(project.forks)
    }))
  }
}

/** Browser tab suffix after the name (`Yongqi He - …`). */
export function documentTitleSuffix(page: Pick<ProfilePage, 'tags'> = profilePage()): string {
  const role = page.tags[0] ?? ''
  const focus = intro.bio.replace(/^./, char => char.toLowerCase())
  return `${role}, ${focus}.`
}

function yamlString(value: string) {
  return JSON.stringify(value)
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function renderWriting(posts: BlogPost[]): string {
  if (posts.length === 0) {
    return `<p className="profile-placeholder">Essays and notes will show up here. For now, the <a href="/blog/">blog</a> is a quiet shelf.</p>`
  }

  const items = posts
    .map(post => {
      const when = post.date
        ? `<time className="profile-when" dateTime=${yamlString(post.date)}>${escapeHtml(post.date)}</time>`
        : ''
      const summary = post.description
        ? `<span className="profile-post-summary">${escapeHtml(post.description)}</span>`
        : ''
      return `<a className="profile-post" href=${yamlString(post.href)}>
<span className="profile-post-top">
<span className="profile-post-title">${escapeHtml(post.title)}</span>
${when}
</span>
${summary}
</a>`
    })
    .join('\n\n')

  return `<div className="profile-posts">
${items}
</div>`
}

/** Doc page of Rspress theme components, not the built-in homepage. */
export function renderHomeMdx(posts: BlogPost[] = [], pinned: PinnedProject[] = []): string {
  const page = profilePage(pinned)
  const tags = page.tags
    .map(tag => `<Badge text=${yamlString(tag)} type="info" outline />`)
    .join(' ')
  const schools = page.education
    .map(
      item => `<article className="profile-job profile-edu">
<div className="profile-job-head">
<h3>${escapeHtml(item.school)}</h3>
<p className="profile-when">${escapeHtml(item.start)} – ${escapeHtml(item.end)}</p>
</div>
<p className="profile-edu-meta">${escapeHtml(item.degree)} · ${escapeHtml(item.major)}</p>
</article>`
    )
    .join('\n\n')
  const jobs = page.experiences
    .map(job => {
      const points = job.points.map(point => `<li>${escapeHtml(point)}</li>`).join('\n')
      return `<article className="profile-job">
<div className="profile-job-head">
<h3><a href=${yamlString(job.href)}>${escapeHtml(job.company)}</a></h3>
<p className="profile-when">${escapeHtml(job.start)} – ${escapeHtml(job.end)}</p>
</div>
<ul>
${points}
</ul>
</article>`
    })
    .join('\n\n')
  const projects = page.projects
    .map(
      project =>
        `<a className="profile-project" href=${yamlString(project.href)}>
<span className="profile-project-top">
<span className="profile-project-name">${escapeHtml(project.name)}</span>
<span className="profile-counts"><Badge text=${yamlString(project.language)} type="info" /> <Badge text=${yamlString(`${project.stars} stars`)} type="info" /> <Badge text=${yamlString(`${project.forks} forks`)} type="info" /></span>
</span>
<span className="profile-project-summary">${escapeHtml(project.summary)}</span>
</a>`
    )
    .join('\n\n')

  return `---
pageType: doc
title: ${yamlString(page.name)}
titleSuffix: ${yamlString(documentTitleSuffix(page))}
sidebar: false
outline: false
footer: false
---

import { Badge } from '@rspress/core/theme'

<div className="profile rp-not-doc">

<header className="profile-hero">
<img className="profile-avatar" src=${yamlString(page.avatar)} alt=${yamlString(page.name)} width="112" height="112" />
<div className="profile-hero-copy">
<p className="profile-kicker">${escapeHtml(page.kicker)}</p>
<h1>${escapeHtml(page.name)}</h1>
<p className="profile-meta">${tags}</p>
</div>
</header>

<section className="profile-section">
<h2>${escapeHtml(page.sections.education)}</h2>

${schools}
</section>

<section className="profile-section">
<h2>${escapeHtml(page.sections.experience)}</h2>

${jobs}
</section>

<section className="profile-section">
<h2>${escapeHtml(page.sections.openSource)}</h2>

<div className="profile-projects">
${projects}
</div>
</section>

<section className="profile-section">
<h2>${escapeHtml(page.sections.skills)}</h2>

<p className="profile-skills"><img src=${yamlString(page.skills.src)} alt=${yamlString(page.skills.alt)} /></p>
</section>

<section className="profile-section profile-writing">
<h2>${escapeHtml(page.sections.writing)}</h2>

${renderWriting(posts)}
</section>

</div>
`
}
