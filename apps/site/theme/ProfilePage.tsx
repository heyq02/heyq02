import {
  siteCardChrome,
  siteCardName,
  siteCardSummary,
  siteH2,
  siteLink,
  sitePageRoot,
  siteSection,
  siteWhen
} from '@heyq02/site-ui'
import { Badge } from '@rspress/core/theme'
import type { ReactElement } from 'react'

import { intro } from '../lib/intro.ts'
import { pinnedProjects } from './profile-data.ts'
import type { ProfileProject } from './profile-data.ts'
import { ProfilePlay } from './ProfilePlay.tsx'

const profileJob =
  'profile-job relative pl-rp-5 before:absolute before:top-rp-1 before:bottom-rp-1 before:left-0 before:w-0.5 before:rounded-full before:bg-rp-brand [&+.profile-job]:mt-rp-6'

const profileJobHead =
  'profile-job-head flex flex-wrap items-baseline justify-between gap-x-rp-4 gap-y-rp-1'

const profileH3 = 'm-0 text-rp-lg font-semibold leading-snug'

const profileList = 'mt-rp-3 mb-0 list-disc pl-rp-5 leading-relaxed text-rp-muted [&_li+li]:mt-rp-1'

const profileEduMeta = 'profile-edu-meta mt-rp-2 mb-0 text-rp-md leading-relaxed text-rp-muted'

const profileCard = `profile-project group grid gap-rp-2 ${siteCardChrome} [&_.rp-badge]:no-underline`

const skillsPicture = (() => {
  const named = intro.skills.filter(skill => skill.icon)
  const icons = named.map(skill => skill.icon).join(',')
  const alt = named.map(skill => skill.name).join(', ')
  const perline = Math.max(named.length, 1)
  return {
    alt,
    src: `https://simpleicons.dev/icons?icons=${icons}&perline=${perline}&theme=light`
  }
})()

function ProjectCard({ project }: { project: ProfileProject }): ReactElement {
  return (
    <a className={profileCard} href={project.href} data-card=''>
      <span className='profile-project-top gap-rp-2 grid'>
        <span className={`profile-project-name ${siteCardName}`}>{project.name}</span>
        <span className='profile-counts gap-rp-1 m-0 flex flex-wrap'>
          <Badge text={project.language} type='info' />
          <Badge text={`${project.stars} 星标`} type='info' />
          <Badge text={`${project.forks} 派生`} type='info' />
        </span>
      </span>
      <span className={`profile-project-summary ${siteCardSummary}`}>{project.summary}</span>
    </a>
  )
}

/** Homepage profile — React page aligned with friends/likes shells. */
export function ProfilePage({
  ssgMd = Boolean(import.meta.env.SSG_MD)
}: {
  ssgMd?: boolean
} = {}): ReactElement {
  if (ssgMd) {
    return (
      <>
        <ProfilePlay tags={intro.tags} ssgMd />
        {`\n## ${intro.sections.education}\n\n`}
        {intro.education
          .map(
            item =>
              `### ${item.school}\n\n${item.start} – ${item.end}\n\n${item.degree} · ${item.major}\n`
          )
          .join('\n')}
        {`\n## ${intro.sections.experience}\n\n`}
        {intro.experiences
          .map(job => {
            const points = job.points.map(point => `- ${point}`).join('\n')
            return `### [${job.company}](${job.href})\n\n${job.start} – ${job.end}\n\n${points}\n`
          })
          .join('\n')}
        {`\n## ${intro.sections.openSource}\n\n`}
        {pinnedProjects
          .map(
            project =>
              `- [${project.name}](${project.href}) — ${project.language} · ${project.stars} 星标 · ${project.forks} 派生\n  ${project.summary}\n`
          )
          .join('\n')}
        {`\n## ${intro.sections.skills}\n\n`}
        {intro.skills.map(skill => `- [${skill.name}](${skill.href})`).join('\n')}
        {'\n'}
      </>
    )
  }

  return (
    <div className={`profile ${sitePageRoot}`}>
      <ProfilePlay tags={intro.tags} />

      <section className={`profile-section ${siteSection}`}>
        <h2 className={siteH2}>{intro.sections.education}</h2>
        {intro.education.map(item => (
          <article key={item.school} className={`${profileJob} profile-edu`}>
            <div className={profileJobHead}>
              <h3 className={profileH3}>{item.school}</h3>
              <p className={`profile-when ${siteWhen}`}>
                {item.start} – {item.end}
              </p>
            </div>
            <p className={profileEduMeta}>
              {item.degree} · {item.major}
            </p>
          </article>
        ))}
      </section>

      <section className={`profile-section ${siteSection}`}>
        <h2 className={siteH2}>{intro.sections.experience}</h2>
        {intro.experiences.map(job => (
          <article key={job.company} className={profileJob}>
            <div className={profileJobHead}>
              <h3 className={profileH3}>
                <a className={siteLink} href={job.href}>
                  {job.company}
                </a>
              </h3>
              <p className={`profile-when ${siteWhen}`}>
                {job.start} – {job.end}
              </p>
            </div>
            <ul className={profileList}>
              {job.points.map(point => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className={`profile-section ${siteSection}`}>
        <h2 className={siteH2}>{intro.sections.openSource}</h2>
        <div className='profile-projects gap-rp-3 grid'>
          {pinnedProjects.map(project => (
            <ProjectCard key={project.href} project={project} />
          ))}
        </div>
      </section>

      <section className={`profile-section ${siteSection}`}>
        <h2 className={siteH2}>{intro.sections.skills}</h2>
        <p className='profile-skills m-0'>
          <img
            className='block h-auto max-w-full dark:invert'
            src={skillsPicture.src}
            alt={skillsPicture.alt}
          />
        </p>
      </section>
    </div>
  )
}
