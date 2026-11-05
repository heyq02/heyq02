import {
  CardLink,
  CardSummary,
  CardTitle,
  Empty,
  PageShell,
  siteCardChrome
} from '@heyq02/rspress-theme-ui'
import { useMemo, useSyncExternalStore } from 'react'
import type { ReactElement } from 'react'

import { friendsData } from './friends-page.ts'
import type { FriendLink } from './friends-page.ts'

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
  'block size-12 shrink-0 rounded-full border border-[var(--rp-c-divider-light)] bg-[var(--rp-c-bg)] object-cover'

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
    <li className='m-0 min-w-0'>
      <CardLink
        href={friend.url}
        className={`flex h-full items-center gap-[calc(var(--rp-radius-small)*1.5)] ${siteCardChrome}`}
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
        <span className='grid min-w-0 gap-[calc(var(--rp-radius-small)/2)]'>
          <CardTitle className='truncate'>{friend.name}</CardTitle>
          {friend.desc ? <CardSummary className='line-clamp-2'>{friend.desc}</CardSummary> : null}
        </span>
      </CardLink>
    </li>
  )
}

/** Avatar + name + desc grid; client shuffle like YunYouJun's links page. */
export function FriendsPage({
  ssgMd = Boolean(import.meta.env.SSG_MD)
}: {
  ssgMd?: boolean
} = {}): ReactElement {
  const { title, friends } = friendsData
  const isClient = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  )
  const ordered = useMemo(() => (isClient ? shuffle(friends) : friends), [friends, isClient])

  return (
    <PageShell title={title} ssgMd={ssgMd} tone='friends'>
      {ordered.length === 0 ? (
        <Empty className='friends-empty mt-[calc(var(--rp-radius-small)*5)]'>还没有友链。</Empty>
      ) : (
        <ul className='friends-grid mt-[calc(var(--rp-radius-small)*5)] mb-0 grid list-none grid-cols-[repeat(auto-fill,minmax(15.5rem,1fr))] gap-[calc(var(--rp-radius-small)*1.5)] p-0'>
          {ordered.map(friend => (
            <FriendCard key={friend.url} friend={friend} ssgMd={ssgMd} />
          ))}
        </ul>
      )}
    </PageShell>
  )
}
