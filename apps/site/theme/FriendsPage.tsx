import Giscus from '@giscus/react'
import {
  CardLink,
  CardSummary,
  CardTitle,
  Empty,
  PageShell,
  Section,
  siteBody,
  siteCardChrome,
  siteMeta,
  sitePanelChrome,
  TextLink
} from '@heyq02/rspress-theme-ui'
import { useMemo, useSyncExternalStore } from 'react'
import type { ReactElement, ReactNode } from 'react'

import { friendsData } from '../lib/friends.ts'
import type { FriendLink } from '../lib/friends.ts'
import { friendsGiscus } from '../lib/giscus.ts'
import { intro } from '../lib/intro.ts'

function friendLabel(friend: FriendLink): string {
  return friend.desc ? `${friend.name} · ${friend.desc}` : friend.name
}

function shuffle<T>(items: T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

function subscribeNever(): () => void {
  return () => {}
}

const avatarClass =
  'block size-12 shrink-0 rounded-full border border-[var(--rp-c-divider-light)] bg-[var(--rp-c-bg)] object-cover transition-transform duration-200 group-hover:scale-105'

function FriendCard({ friend, ssgMd }: { friend: FriendLink; ssgMd: boolean }): ReactElement {
  // Prefer readable link text for SSG-MD Agents over avatar+span chrome.
  if (ssgMd) {
    return (
      <li>
        <a href={friend.url}>{friend.name}</a>
        {friend.desc ? ` — ${friend.desc}` : null}
      </li>
    )
  }

  return (
    <li className='hey-rise m-0 min-w-0'>
      <CardLink
        href={friend.url}
        className={`flex h-full items-center gap-[var(--hey-space-md)] ${siteCardChrome}`}
        external
        rel='noopener noreferrer friend'
        title={friend.name}
        aria-label={friendLabel(friend)}
      >
        <img
          className={avatarClass}
          src={friend.avatar}
          alt=''
          width={48}
          height={48}
          loading='lazy'
          decoding='async'
        />
        <span className='grid min-w-0 gap-[var(--hey-space-2xs)]'>
          <CardTitle className='truncate'>{friend.name}</CardTitle>
          {friend.desc ? <CardSummary className='line-clamp-2'>{friend.desc}</CardSummary> : null}
        </span>
      </CardLink>
    </li>
  )
}

function ApplySection({ ssgMd }: { ssgMd: boolean }): ReactNode {
  const apply = friendsData.apply
  if (!apply) {
    return null
  }

  const discussionsUrl = `https://github.com/${friendsGiscus.repo}/discussions/categories/announcements`

  if (ssgMd) {
    return `\n## ${apply.title}\n\n${apply.intro}\n\n本站：${intro.name} · ${intro.site} · ${intro.avatar} · ${intro.bio}\n\n评论：${discussionsUrl}\n`
  }

  return (
    <Section title={apply.title} id='apply'>
      <p className={siteBody}>{apply.intro}</p>
      <dl
        className={`${sitePanelChrome} mt-[var(--hey-space-lg)] mb-0 grid gap-[var(--hey-space-sm)] text-[1rem] leading-relaxed`}
      >
        <div className='grid gap-[var(--hey-space-2xs)] sm:grid-cols-[4.5rem_1fr] sm:items-baseline'>
          <dt className={siteMeta}>本站</dt>
          <dd className='m-0'>
            <TextLink href={intro.site}>{intro.name}</TextLink>
          </dd>
        </div>
        <div className='grid gap-[var(--hey-space-2xs)] sm:grid-cols-[4.5rem_1fr] sm:items-baseline'>
          <dt className={siteMeta}>链接</dt>
          <dd className='m-0 break-all'>
            <TextLink href={intro.site}>{intro.site}</TextLink>
          </dd>
        </div>
        <div className='grid gap-[var(--hey-space-2xs)] sm:grid-cols-[4.5rem_1fr] sm:items-baseline'>
          <dt className={siteMeta}>头像</dt>
          <dd className='m-0 break-all'>
            <TextLink href={intro.avatar}>{intro.avatar}</TextLink>
          </dd>
        </div>
        <div className='grid gap-[var(--hey-space-2xs)] sm:grid-cols-[4.5rem_1fr] sm:items-baseline'>
          <dt className={siteMeta}>简介</dt>
          <dd className='m-0 text-[var(--rp-c-text-2)]'>{intro.bio}</dd>
        </div>
      </dl>
      <div className='friends-giscus mt-[var(--hey-space-xl)]'>
        <Giscus {...friendsGiscus} />
      </div>
    </Section>
  )
}

/** Avatar + name + desc grid; reshuffled once per page load (no manual control). */
export function FriendsPage({
  ssgMd = Boolean(import.meta.env.SSG_MD)
}: {
  ssgMd?: boolean
} = {}): ReactElement {
  const { title, friends } = friendsData
  // SSR and hydration both render the declared order.
  // The client snapshot flips afterwards, so each load shuffles once without a hydration mismatch.
  const isClient = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  )
  const ordered = useMemo(() => (isClient ? shuffle(friends) : friends), [friends, isClient])

  return (
    <div id='hey-main' tabIndex={-1}>
      <PageShell title={title} ssgMd={ssgMd} tone='friends'>
        {ordered.length === 0 ? (
          <Empty className='friends-empty mt-[var(--hey-space-3xl)]'>还没有友链。</Empty>
        ) : (
          <ul className='friends-grid mt-[var(--hey-space-3xl)] mb-0 grid list-none grid-cols-[repeat(auto-fill,minmax(var(--hey-friend-card-min),1fr))] gap-[var(--hey-space-md)] p-0'>
            {ordered.map(friend => (
              <FriendCard key={friend.url} friend={friend} ssgMd={ssgMd} />
            ))}
          </ul>
        )}
        <ApplySection ssgMd={ssgMd} />
      </PageShell>
    </div>
  )
}
