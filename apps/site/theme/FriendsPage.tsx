import {
  CardLink,
  CardSummary,
  CardTitle,
  Empty,
  PageShell,
  siteCardChrome,
  siteFocusRing,
  siteMeta
} from '@heyq02/rspress-theme-ui'
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react'
import type { ReactElement } from 'react'

import { friendsData } from '../lib/friends.ts'
import type { FriendLink } from '../lib/friends.ts'

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
  const [deal, setDeal] = useState(0)
  const isClient = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  )
  const ordered = useMemo(() => {
    if (!isClient) {
      return friends
    }
    // `deal` is the reshuffle token — bumping it must re-run shuffle.
    return deal >= 0 ? shuffle(friends) : friends
  }, [friends, isClient, deal])

  const reshuffle = useCallback(() => {
    setDeal(value => value + 1)
  }, [])

  return (
    <PageShell title={title} ssgMd={ssgMd} tone='friends'>
      {ordered.length === 0 ? (
        <Empty className='friends-empty mt-[calc(var(--rp-radius-small)*5)]'>还没有友链。</Empty>
      ) : (
        <>
          {ssgMd ? null : (
            <p className='mt-[calc(var(--rp-radius-small)*5)] mb-0 flex justify-end'>
              <button
                type='button'
                onClick={reshuffle}
                className={`cursor-pointer rounded-[var(--rp-radius-small)] border-0 bg-transparent px-[calc(var(--rp-radius-small)/2)] py-[calc(var(--rp-radius-small)/2)] ${siteMeta} transition-[color,transform] duration-200 hover:-translate-y-px hover:text-[var(--rp-c-brand)] active:scale-95 ${siteFocusRing}`}
                aria-label='重新打乱友链顺序'
                title='再洗一次'
              >
                换一批 ↻
              </button>
            </p>
          )}
          <ul
            key={deal}
            className={`friends-grid mb-0 grid list-none grid-cols-[repeat(auto-fill,minmax(15.5rem,1fr))] gap-[calc(var(--rp-radius-small)*1.5)] p-0${ssgMd ? ' mt-[calc(var(--rp-radius-small)*5)]' : ' mt-[var(--rp-radius)]'}`}
          >
            {ordered.map(friend => (
              <FriendCard key={friend.url} friend={friend} ssgMd={ssgMd} />
            ))}
          </ul>
        </>
      )}
    </PageShell>
  )
}
