import {
  Body,
  CardLink,
  CardSummary,
  CardTitle,
  Section,
  siteCardChrome,
  sitePageRoot,
  siteTile,
  siteWhen,
  TextLink
} from '@heyq02/rspress-theme-ui'
import { Badge } from '@rspress/core/theme'
import type { ReactElement } from 'react'

import { intro } from '../lib/intro.ts'
import { likesData } from './likes-data.ts'
import { ContributionHeatmap } from './ContributionHeatmap.tsx'
import { contributionCalendar, pinnedProjects, skillsPicture } from './profile-data.ts'
import type { ProfileProject } from './profile-data.ts'
import { ProfilePlay } from './ProfilePlay.tsx'

const interestGlyphs: Record<string, string> = {
  uses: '⌘',
  music: '♪',
  games: '▶',
  watching: '▣',
  visits: '⌖',
  reading: '¶'
}

const peekIds = ['uses', 'music', 'games', 'reading'] as const

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
  const bioParts = intro.bio.split(/\n\n/).filter(Boolean)
  const peeks = likesData.categories.filter(category =>
    (peekIds as readonly string[]).includes(category.id)
  )

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
        {`\n## ${intro.sections.about}\n\n`}
        {`${intro.bio}\n\n`}
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
        {`\n## ${intro.sections.interests}\n\n`}
        {peeks.map(category => `- [${category.title}](${category.href}) — ${category.desc}\n`).join('')}
        {`\n## ${intro.sections.skills}\n\n`}
        {intro.skills.map(skill => `- [${skill.name}](${skill.href})`).join('\n')}
        {'\n'}
      </>
    )
  }

  return (
    <div className={`profile ${sitePageRoot}`}>
      <ProfilePlay tags={intro.tags} />

      <Section marker='profile-section hey-rise hey-rise-delay-1' title={intro.sections.about}>
        <div className='gap-rp-3 grid max-w-2xl'>
          {bioParts.map(part => (
            <Body key={part}>{part}</Body>
          ))}
          <p className='text-rp-sm text-rp-muted m-0'>
            写点什么可以丢邮件给我：
            <TextLink href={`mailto:${intro.contact.email}`} className='text-rp-link ml-rp-1'>
              {intro.contact.email}
            </TextLink>
          </p>
        </div>
      </Section>

      <Section
        marker='profile-section hey-rise hey-rise-delay-2'
        title={intro.sections.contributions}
      >
        <ContributionHeatmap calendar={contributionCalendar} />
      </Section>

      <Section marker='profile-section hey-rise hey-rise-delay-3' title={intro.sections.openSource}>
        <div className='profile-projects gap-rp-3 grid'>
          {pinnedProjects.map(project => (
            <ProjectCard key={project.href} project={project} />
          ))}
        </div>
      </Section>

      <Section marker='profile-section' title={intro.sections.interests}>
        <div className='gap-rp-3 grid grid-cols-1 sm:grid-cols-2'>
          {peeks.map(category => (
            <CardLink
              key={category.id}
              href={category.href}
              external={false}
              className={`group p-rp-4 relative overflow-hidden ${siteTile} bg-gradient-to-br from-[color-mix(in_oklab,var(--rp-c-brand)_14%,transparent)] to-transparent transition-transform duration-200 hover:-translate-y-0.5`}
            >
              <span className='top-rp-3 right-rp-3 text-rp-2xl text-rp-muted pointer-events-none absolute font-mono opacity-35 transition-opacity group-hover:opacity-70'>
                {interestGlyphs[category.id] ?? '·'}
              </span>
              <span className='gap-rp-2 grid'>
                <CardTitle>{category.title}</CardTitle>
                <CardSummary className='max-w-xs'>{category.desc}</CardSummary>
                <span className={siteWhen}>{category.countLabel}</span>
              </span>
            </CardLink>
          ))}
        </div>
        <p className='mt-rp-3 mb-0'>
          <TextLink href='/likes/' className='text-rp-brand' external={false}>
            去兴趣页逛逛 →
          </TextLink>
        </p>
      </Section>

      <Section marker='profile-section' title={intro.sections.skills}>
        <p className='profile-skills m-0 opacity-90'>
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
