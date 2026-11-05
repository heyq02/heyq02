import {
  CardLink,
  CardSummary,
  CardTitle,
  ContributionHeatmap,
  JumpRail,
  ProfileHero,
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
import { contributionCalendar, formatCount, pinnedProjects } from '../lib/github-profile.ts'
import type { GithubPinnedProject } from '../lib/github-profile.ts'
import { intro } from '../lib/intro.ts'
import { recentPosts } from '../lib/recent-posts.ts'
import type { RecentPost } from '../lib/recent-posts.ts'

function PostCard({ post }: { post: RecentPost }): ReactElement {
  return (
    <CardLink href={post.href} external={false} className={`group block ${siteCardChrome}`}>
      <CardTitle className='text-[1.125rem]'>{post.title}</CardTitle>
      {post.description ? (
        <CardSummary className='mt-[var(--rp-radius-small)] line-clamp-2'>
          {post.description}
        </CardSummary>
      ) : null}
      <p className={`mt-[calc(var(--rp-radius-small)*1.5)] mb-0 ${siteWhen}`}>
        {post.date ? formatZhDate(post.date) : null}
      </p>
    </CardLink>
  )
}

function ProjectCard({ project }: { project: GithubPinnedProject }): ReactElement {
  return (
    <CardLink
      href={project.href}
      className={`group relative flex h-full flex-col gap-[var(--rp-radius-small)] ${siteCardChrome} [&_.rp-badge]:no-underline`}
      external={false}
    >
      <span className='flex flex-wrap items-baseline gap-[var(--rp-radius-small)]'>
        <CardTitle className='profile-project-name'>{project.name}</CardTitle>
        <span className='m-0 flex flex-wrap gap-[calc(var(--rp-radius-small)/2)]'>
          <Badge text={project.language} type='info' />
          <Badge text={`${formatCount(project.stars)} 星标`} type='info' />
        </span>
      </span>
      <CardSummary className={siteCardSummary}>{project.summary}</CardSummary>
    </CardLink>
  )
}

/** Homepage profile — wires site data into theme-ui sections. */
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
        <ProfileHero intro={intro} ssgMd />
        {`\n## ${intro.sections.openSource}\n\n`}
        {pinnedProjects
          .map(
            project =>
              `- [${project.name}](${project.href}) — ${project.language} · ${formatCount(project.stars)} 星标 · ${formatCount(project.forks)} 派生\n  ${project.summary}\n`
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
      <ProfileHero intro={intro} />

      <JumpRail label={intro.sections.openSource} targetId='profile-open-source' />

      <Section
        marker='profile-section hey-rise hey-rise-delay-1'
        className='!mt-0 scroll-mt-[calc(var(--rp-radius-large)*2)]'
      >
        <div
          id='profile-open-source'
          className='profile-projects grid grid-cols-1 gap-[var(--rp-radius)] sm:grid-cols-2'
        >
          {pinnedProjects.map(project => (
            <ProjectCard key={project.href} project={project} />
          ))}
        </div>
        <div className='mt-[var(--rp-radius-large)]'>
          <ContributionHeatmap calendar={contributionCalendar} />
        </div>
      </Section>

      <JumpRail label={intro.sections.blog} targetId='profile-blog' />

      <Section
        marker='profile-section hey-rise hey-rise-delay-2'
        className='!mt-0 scroll-mt-[calc(var(--rp-radius-large)*2)]'
      >
        <div id='profile-blog' className='grid gap-[var(--rp-radius)]'>
          {recentPosts.map(post => (
            <PostCard key={post.href} post={post} />
          ))}
        </div>
        <p className='mt-[var(--rp-radius-large)] mb-0'>
          <a
            href='/blog/'
            className={`inline-flex rounded-full bg-[var(--rp-c-text-1)] px-4 py-2 text-sm font-medium text-[var(--rp-c-bg)] no-underline transition-[color,background-color,transform] duration-200 hover:-translate-y-px hover:bg-[var(--rp-c-brand)] hover:no-underline active:scale-[0.98] ${siteFocusRing}`}
          >
            查看所有文章
          </a>
        </p>
      </Section>
    </div>
  )
}
