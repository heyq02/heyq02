import {
  CardLink,
  CardSummary,
  CardTitle,
  Section,
  siteCardChrome,
  siteCardSummary,
  siteFocusRing,
  sitePageRoot,
  siteWhen
} from '@heyq02/rspress-theme-ui'
import { Badge } from '@rspress/core/theme'
import type { ReactElement } from 'react'

import { formatZhDate } from '../lib/format.ts'
import { intro } from '../lib/intro.ts'
import { ContributionHeatmap } from './ContributionHeatmap.tsx'
import { JumpRail } from './JumpRail.tsx'
import { contributionCalendar, pinnedProjects } from './profile-data.ts'
import type { ProfileProject } from './profile-data.ts'
import { ProfilePlay } from './ProfilePlay.tsx'
import { recentPosts } from './recent-posts.ts'
import type { RecentPost } from './recent-posts.ts'

function PostCard({ post }: { post: RecentPost }): ReactElement {
  return (
    <CardLink href={post.href} external={false} className={`group block ${siteCardChrome}`}>
      <CardTitle className='text-rp-lg'>{post.title}</CardTitle>
      {post.description ? (
        <CardSummary className='mt-rp-2 line-clamp-2'>{post.description}</CardSummary>
      ) : null}
      <p className={`mt-rp-3 mb-0 ${siteWhen}`}>{post.date ? formatZhDate(post.date) : null}</p>
    </CardLink>
  )
}

function ProjectCard({ project }: { project: ProfileProject }): ReactElement {
  return (
    <CardLink
      href={project.href}
      className={`group gap-rp-2 relative flex h-full flex-col ${siteCardChrome} [&_.rp-badge]:no-underline`}
      external={false}
    >
      <span className='gap-rp-2 flex flex-wrap items-baseline'>
        <CardTitle className='profile-project-name'>{project.name}</CardTitle>
        <span className='gap-rp-1 m-0 flex flex-wrap'>
          <Badge text={project.language} type='info' />
          <Badge text={`${project.stars} 星标`} type='info' />
        </span>
      </span>
      <CardSummary className={siteCardSummary}>{project.summary}</CardSummary>
    </CardLink>
  )
}

/** Homepage profile — React page aligned with friends shell. */
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
        {`\n## ${intro.sections.openSource}\n\n`}
        {pinnedProjects
          .map(
            project =>
              `- [${project.name}](${project.href}) — ${project.language} · ${project.stars} 星标 · ${project.forks} 派生\n  ${project.summary}\n`
          )
          .join('\n')}
        {`\n近一年贡献：[${contributionCalendar.total} 次](${contributionCalendar.href})\n\n`}
        {contributionLines ? `${contributionLines}\n` : ''}
        {`\n## ${intro.sections.blog}\n\n`}
        {recentPosts
          .map(post => `- [${post.title}](${post.href}) — ${post.date}\n  ${post.description}\n`)
          .join('\n')}
        {'\n'}
      </>
    )
  }

  return (
    <div className={`profile ${sitePageRoot}`}>
      <ProfilePlay tags={intro.tags} />

      <JumpRail label={intro.sections.openSource} />

      <Section marker='profile-section hey-rise hey-rise-delay-1' className='!mt-0'>
        <div className='profile-projects gap-rp-4 grid grid-cols-1 sm:grid-cols-2'>
          {pinnedProjects.map(project => (
            <ProjectCard key={project.href} project={project} />
          ))}
        </div>
        <div className='mt-rp-6'>
          <ContributionHeatmap calendar={contributionCalendar} />
        </div>
      </Section>

      <JumpRail label={intro.sections.blog} />

      <Section marker='profile-section' className='!mt-0'>
        <div className='gap-rp-4 grid'>
          {recentPosts.map(post => (
            <PostCard key={post.href} post={post} />
          ))}
        </div>
        <p className='mt-rp-6 mb-0'>
          <a
            href='/blog/'
            className={`bg-rp-text text-rp-bg hover:bg-rp-brand inline-flex rounded-full px-4 py-2 text-sm font-medium no-underline transition-colors hover:no-underline ${siteFocusRing}`}
          >
            查看所有文章
          </a>
        </p>
      </Section>
    </div>
  )
}
