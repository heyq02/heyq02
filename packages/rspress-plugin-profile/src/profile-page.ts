import { formatCount, intro, skillIconsPicture } from '@heyq02/shared'
import type { Intro } from '@heyq02/shared'
import type { PinnedProject } from 'rspress-plugin-github-pins'

import {
  profileCard,
  profileCardName,
  profileCardSummary,
  profileCardTop,
  profileCounts,
  profileEduMeta,
  profileGrid,
  profileH2,
  profileH3,
  profileJob,
  profileJobHead,
  profileLink,
  profileList,
  profileRoot,
  profileSection,
  profileSkills,
  profileSkillsImg,
  profileWhen
} from './profile-classes.ts'

/** Site languages; `en` keeps the unprefixed routes. */
export type ProfileLang = 'en' | 'zh'

interface ProfilePage {
  name: string
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

export interface RenderHomeMdxOptions {
  /** MDX import path for ProfilePlay, relative to `blogs/<lang>/index.mdx`. */
  profilePlayModule?: string
}

/** Chinese section headings for `/zh/`; English sections come from intro.json. */
const ZH_SECTIONS: Record<keyof Intro['sections'], string> = {
  education: '教育经历',
  experience: '工作经历',
  skills: '技能',
  openSource: '开源项目'
}

/** Section headings for a language (identity facts stay English). */
export function sectionsFor(lang: ProfileLang): Intro['sections'] {
  return lang === 'zh' ? { ...intro.sections, ...ZH_SECTIONS } : intro.sections
}

export function profilePage(projects: PinnedProject[] = [], lang: ProfileLang = 'en'): ProfilePage {
  return {
    name: intro.name,
    tags: intro.tags,
    avatar: intro.avatar,
    sections: sectionsFor(lang),
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

/** Browser tab suffix after the name (`Ari He｜阿瑞 - …`). */
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

/** Doc page of Rspress theme components, not the built-in homepage. */
export function renderHomeMdx(
  pinned: PinnedProject[] = [],
  options: RenderHomeMdxOptions & { lang?: ProfileLang } = {}
): string {
  const profilePlayModule = options.profilePlayModule ?? '@theme/ProfilePlay'
  const page = profilePage(pinned, options.lang ?? 'en')
  const tags = page.tags
    .map(tag => `<Badge text=${yamlString(tag)} type="info" outline />`)
    .join(' ')
  const schools = page.education
    .map(
      item => `<article className=${yamlString(`${profileJob} profile-edu`)}>
<div className=${yamlString(profileJobHead)}>
<h3 className=${yamlString(profileH3)}>${escapeHtml(item.school)}</h3>
<p className=${yamlString(profileWhen)}>${escapeHtml(item.start)} – ${escapeHtml(item.end)}</p>
</div>
<p className=${yamlString(profileEduMeta)}>${escapeHtml(item.degree)} · ${escapeHtml(item.major)}</p>
</article>`
    )
    .join('\n\n')
  const jobs = page.experiences
    .map(job => {
      const points = job.points.map(point => `<li>${escapeHtml(point)}</li>`).join('\n')
      return `<article className=${yamlString(profileJob)}>
<div className=${yamlString(profileJobHead)}>
<h3 className=${yamlString(profileH3)}><a className=${yamlString(profileLink)} href=${yamlString(job.href)}>${escapeHtml(job.company)}</a></h3>
<p className=${yamlString(profileWhen)}>${escapeHtml(job.start)} – ${escapeHtml(job.end)}</p>
</div>
<ul className=${yamlString(profileList)}>
${points}
</ul>
</article>`
    })
    .join('\n\n')
  const projects = page.projects
    .map(
      project =>
        `<a className=${yamlString(profileCard)} href=${yamlString(project.href)} data-card="">
<span className=${yamlString(`profile-project-top ${profileCardTop}`)}>
<span className=${yamlString(`profile-project-name ${profileCardName}`)}>${escapeHtml(project.name)}</span>
<span className=${yamlString(profileCounts)}><Badge text=${yamlString(project.language)} type="info" /> <Badge text=${yamlString(`${project.stars} stars`)} type="info" /> <Badge text=${yamlString(`${project.forks} forks`)} type="info" /></span>
</span>
<span className=${yamlString(`profile-project-summary ${profileCardSummary}`)}>${escapeHtml(project.summary)}</span>
</a>`
    )
    .join('\n\n')

  return `---
pageType: doc-wide
title: ${yamlString(page.name)}
titleSuffix: ${yamlString(documentTitleSuffix(page))}
sidebar: false
outline: false
footer: false
---

import { Badge } from '@rspress/core/theme'
import { ProfilePlay } from '${profilePlayModule}'

<div className=${yamlString(profileRoot)}>

<ProfilePlay tags={<>${tags}</>} />

<section className=${yamlString(profileSection)}>
<h2 className=${yamlString(profileH2)}>${escapeHtml(page.sections.education)}</h2>

${schools}
</section>

<section className=${yamlString(profileSection)}>
<h2 className=${yamlString(profileH2)}>${escapeHtml(page.sections.experience)}</h2>

${jobs}
</section>

<section className=${yamlString(profileSection)}>
<h2 className=${yamlString(profileH2)}>${escapeHtml(page.sections.openSource)}</h2>

<div className=${yamlString(`profile-projects ${profileGrid}`)}>
${projects}
</div>
</section>

<section className=${yamlString(profileSection)}>
<h2 className=${yamlString(profileH2)}>${escapeHtml(page.sections.skills)}</h2>

<p className=${yamlString(profileSkills)}><img className=${yamlString(profileSkillsImg)} src=${yamlString(page.skills.src)} alt=${yamlString(page.skills.alt)} /></p>
</section>

</div>
`
}
