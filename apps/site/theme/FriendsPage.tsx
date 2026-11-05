import {
  CardLink,
  CardSummary,
  CardTitle,
  Empty,
  PageShell,
  siteCardChrome,
  siteControlPad,
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
    <div id='hey-main' tabIndex={-1}>
      <PageShell title={title} ssgMd={ssgMd} tone='friends'>
        {ordered.length === 0 ? (
          <Empty className='friends-empty mt-[var(--hey-space-3xl)]'>还没有友链。</Empty>
        ) : (
          <>
            {ssgMd ? null : (
              <p className='mt-[var(--hey-space-3xl)] mb-0 flex items-center justify-end gap-[var(--hey-space-lg)]'>
                <span className='sr-only' aria-live='polite'>
                  {deal === 0 ? '' : `已重新打乱，共 ${ordered.length} 个友链`}
                </span>
                <button
                  type='button'
                  onClick={reshuffle}
                  className={`cursor-pointer rounded-[var(--rp-radius-small)] border-0 bg-transparent ${siteControlPad} ${siteMeta} transition-[color,transform] duration-200 hover:-translate-y-px hover:text-[var(--rp-c-brand)] active:scale-95 ${siteFocusRing}`}
                  aria-label='重新打乱友链顺序'
                  title='再洗一次'
                >
                  换一批 ↻
                </button>
              </p>
            )}
            <ul
              key={deal}
              className={`friends-grid mb-0 grid list-none grid-cols-[repeat(auto-fill,minmax(var(--hey-friend-card-min),1fr))] gap-[var(--hey-space-md)] p-0${ssgMd ? ' mt-[var(--hey-space-3xl)]' : ' mt-[var(--hey-space-lg)]'}`}
            >
              {ordered.map(friend => (
                <FriendCard key={friend.url} friend={friend} ssgMd={ssgMd} />
              ))}
            </ul>
          </>
        )}
      </PageShell>
    </div>
  )
}
