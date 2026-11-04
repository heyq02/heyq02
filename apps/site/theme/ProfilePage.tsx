import {
  CardLink,
  CardSummary,
  CardTitle,
  Section,
  siteCardChrome,
  sitePageRoot
} from '@heyq02/rspress-theme-ui'
import { Badge } from '@rspress/core/theme'
import type { ReactElement } from 'react'

import { intro } from '../lib/intro.ts'
import { ContributionHeatmap } from './ContributionHeatmap.tsx'
import { contributionCalendar, pinnedProjects, skillsPicture } from './profile-data.ts'
import type { ProfileProject } from './profile-data.ts'
import { ProfilePlay } from './ProfilePlay.tsx'

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
    const contributionLines = contributionCalendar.weeks
      .flat()
      .filter(day => day.count > 0)
      .slice(0, 14)
      .map(day => `- ${day.date}: ${day.count}`)
      .join('\n')

    return (
      <>
        <ProfilePlay tags={intro.tags} ssgMd />
        {`\n## ${intro.sections.contributions}\n\n`}
        {`近一年 [${contributionCalendar.total} 次贡献](${contributionCalendar.href})\n\n`}
        {contributionLines ? `${contributionLines}\n` : ''}
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

      <Section marker='profile-section' title={intro.sections.contributions}>
        <ContributionHeatmap calendar={contributionCalendar} />
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
