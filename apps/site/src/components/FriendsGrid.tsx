import { useMemo, useSyncExternalStore } from 'react'
import type { ReactElement } from 'react'

import type { FriendLink, FriendsData } from '../lib/friends.ts'
import {
  siteBody,
  siteCardChrome,
  siteCardName,
  siteCardSummary,
  siteEmpty,
  siteH1,
  siteH2,
  siteHeaderRule,
  siteLink,
  sitePageRoot,
  sitePanelChrome,
  siteSection
} from '../lib/site-ui.ts'

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
  'block size-12 shrink-0 rounded-full border border-[var(--site-divider-light)] bg-[var(--site-bg)] object-cover'

const friendCardClass = `group flex h-full items-center gap-[0.85rem] ${siteCardChrome}`

const exchangePanelClass = `mt-5 flex flex-col items-start gap-4 ${sitePanelChrome} sm:flex-row`

const fieldLabelClass =
  'm-0 font-[family-name:var(--site-mono)] text-[0.72rem] font-medium tracking-[0.06em] text-[var(--site-text-2)] uppercase'

const fieldValueClass = 'm-0 text-[0.95rem] leading-normal text-[var(--site-text-1)] wrap-anywhere'

const fieldRowClass =
  'grid grid-cols-1 items-baseline gap-x-3 gap-y-[0.15rem] sm:grid-cols-[4.5rem_1fr] sm:gap-y-2'

function FriendCard({ friend }: { friend: FriendLink }): ReactElement {
  return (
    <li className='m-0 min-w-0'>
      <a
        className={friendCardClass}
        href={friend.url}
        target='_blank'
        rel='noopener noreferrer friend'
        title={friend.name}
        aria-label={friendLabel(friend)}
        data-card=''
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
        <span className='grid min-w-0 gap-1'>
          <span className={`truncate ${siteCardName}`}>{friend.name}</span>
          {friend.desc ? (
            <span className={`line-clamp-2 ${siteCardSummary}`}>{friend.desc}</span>
          ) : null}
        </span>
      </a>
    </li>
  )
}

/** Avatar + name + desc grid; client shuffle like YunYouJun's links page. */
export default function FriendsGrid({ data }: { data: FriendsData }): ReactElement {
  const { title, intro, exchange, friends } = data
  const isClient = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  )
  const ordered = useMemo(() => (isClient ? shuffle(friends) : friends), [friends, isClient])

  return (
    <div className={`friends ${sitePageRoot}`}>
      <header className={siteHeaderRule}>
        <h1 className={siteH1}>{title}</h1>
        <p className={`mt-3 ${siteBody}`}>{intro}</p>
        <p className='mt-[0.45rem] mb-0 font-[family-name:var(--site-mono)] text-[0.78rem] font-medium tracking-[0.02em] text-[var(--site-text-2)]'>
          每次访问都会重新排序，换个顺序打个招呼。
        </p>
      </header>

      {ordered.length === 0 ? (
        <p className={`friends-empty ${siteSection} ${siteEmpty}`}>
          还没有友链，等第一位朋友来交换。
        </p>
      ) : (
        <ul
          className={`friends-grid ${siteSection} mb-0 grid list-none grid-cols-[repeat(auto-fill,minmax(15.5rem,1fr))] gap-3 p-0`}
        >
          {ordered.map(friend => (
            <FriendCard key={friend.url} friend={friend} />
          ))}
        </ul>
      )}

      <section
        className={`friends-exchange ${siteSection} border-t border-[var(--site-divider-light)] pt-8`}
      >
        <h2 className={siteH2}>{exchange.title}</h2>
        <p className={siteBody}>{exchange.body}</p>
        <div className={exchangePanelClass}>
          <img
            className={avatarClass}
            src={exchange.self.avatar}
            alt=''
            width={48}
            height={48}
            loading='lazy'
            decoding='async'
          />
          <dl className='m-0 grid min-w-0 gap-[0.55rem]'>
            <div className={fieldRowClass}>
              <dt className={fieldLabelClass}>名称</dt>
              <dd className={fieldValueClass}>{exchange.self.name}</dd>
            </div>
            <div className={fieldRowClass}>
              <dt className={fieldLabelClass}>站点</dt>
              <dd className={fieldValueClass}>
                <a className={siteLink} href={exchange.self.url}>
                  {exchange.self.url}
                </a>
              </dd>
            </div>
            <div className={fieldRowClass}>
              <dt className={fieldLabelClass}>头像</dt>
              <dd className={fieldValueClass}>
                <a className={siteLink} href={exchange.self.avatar}>
                  {exchange.self.avatar}
                </a>
              </dd>
            </div>
            <div className={fieldRowClass}>
              <dt className={fieldLabelClass}>简介</dt>
              <dd className={fieldValueClass}>{exchange.self.desc}</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  )
}
