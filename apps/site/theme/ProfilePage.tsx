import {
  CardLink,
  CardSummary,
  CardTitle,
  Section,
  TextLink,
  When,
  siteCardChrome,
  sitePageRoot
} from '@heyq02/rspress-theme-ui'
import { Badge } from '@rspress/core/theme'
import type { ReactElement } from 'react'

import { intro } from '../lib/intro.ts'
import { pinnedProjects, skillsPicture } from './profile-data.ts'
import type { ProfileProject } from './profile-data.ts'
import { ProfilePlay } from './ProfilePlay.tsx'

const profileJob =
  'profile-job relative pl-rp-5 before:absolute before:top-rp-1 before:bottom-rp-1 before:left-0 before:w-0.5 before:rounded-full before:bg-rp-brand [&+.profile-job]:mt-rp-6'

const profileJobHead =
  'profile-job-head flex flex-wrap items-baseline justify-between gap-x-rp-4 gap-y-rp-1'

const profileH3 = 'm-0 text-rp-lg font-semibold leading-snug'

const profileList = 'mt-rp-3 mb-0 list-disc pl-rp-5 leading-relaxed text-rp-muted [&_li+li]:mt-rp-1'

const profileEduMeta = 'profile-edu-meta mt-rp-2 mb-0 text-rp-md leading-relaxed text-rp-muted'

function ProjectCard({ project }: { project: ProfileProject }): ReactElement {
  return (
    <CardLink
      href={project.href}
      className={`profile-project gap-rp-2 grid ${siteCardChrome} [&_.rp-badge]:no-underline`}
      external={false}
    >
      <span className='profile-project-top gap-rp-2 grid'>
        <CardTitle className='profile-project-name'>{project.name}</CardTitle>
        <span className='profile-counts gap-rp-1 m-0 flex flex-wrap'>
          <Badge text={project.language} type='info' />
          <Badge text={`${project.stars} 星标`} type='info' />
          <Badge text={`${project.forks} 派生`} type='info' />
        </span>
      </span>
      <CardSummary className='profile-project-summary'>{project.summary}</CardSummary>
    </CardLink>
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

      <Section marker='profile-section' title={intro.sections.education}>
        {intro.education.map(item => (
          <article key={item.school} className={`${profileJob} profile-edu`}>
            <div className={profileJobHead}>
              <h3 className={profileH3}>{item.school}</h3>
              <When className='profile-when'>
                {item.start} – {item.end}
              </When>
            </div>
            <p className={profileEduMeta}>
              {item.degree} · {item.major}
            </p>
          </article>
        ))}
      </Section>

      <Section marker='profile-section' title={intro.sections.experience}>
        {intro.experiences.map(job => (
          <article key={job.company} className={profileJob}>
            <div className={profileJobHead}>
              <h3 className={profileH3}>
                <TextLink href={job.href}>{job.company}</TextLink>
              </h3>
              <When className='profile-when'>
                {job.start} – {job.end}
              </When>
            </div>
            <ul className={profileList}>
              {job.points.map(point => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </Section>

      <Section marker='profile-section' title={intro.sections.openSource}>
        <div className='profile-projects gap-rp-3 grid'>
          {pinnedProjects.map(project => (
            <ProjectCard key={project.href} project={project} />
          ))}
        </div>
      </Section>

      <Section marker='profile-section' title={intro.sections.skills}>
        <p className='profile-skills m-0'>
          <img
            className='block h-auto max-w-full dark:invert'
            src={skillsPicture.src}
            alt={skillsPicture.alt}
          />
        </p>
      </Section>
    </div>
  )
}
