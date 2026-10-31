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

const headingClass =
  'm-0 text-[clamp(2.1rem,5.5vw,2.75rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--rp-c-text-1)]'

const sectionHeadingClass =
  "m-0 mb-[0.85rem] text-[1.25rem] font-[650] leading-[1.3] text-[var(--rp-c-text-1)] after:mt-2 after:block after:h-0.5 after:w-8 after:bg-[var(--rp-c-brand)] after:content-['']"

const linkClass =
  'font-semibold text-inherit no-underline hover:text-[var(--rp-c-link)] hover:underline hover:underline-offset-[3px]'

const cardClass =
  'group flex h-full items-center gap-[0.85rem] rounded-[var(--rp-radius-small)] border border-[var(--rp-c-divider-light)] bg-[var(--rp-c-bg-soft)] px-4 py-[0.9rem] font-normal text-inherit !no-underline transition-[border-color,background-color,box-shadow] duration-200 hover:border-[var(--rp-c-brand)] hover:bg-[var(--rp-c-bg)] hover:text-inherit hover:shadow-[var(--rp-shadow-1)] hover:!no-underline'

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
      <a
        className={cardClass}
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
          <span className='truncate text-[0.98rem] font-[650] leading-[1.35] text-[var(--rp-c-text-1)] transition-colors duration-200 group-hover:text-[var(--rp-c-brand)]'>
            {friend.name}
          </span>
          {friend.desc ? (
            <span className='line-clamp-2 text-[0.86rem] font-normal leading-[1.45] text-[var(--rp-c-text-2)]'>
              {friend.desc}
            </span>
          ) : null}
        </span>
      </a>
    </li>
  )
}

/** Avatar + name + desc grid; client shuffle like YunYouJun's links page. */
export function FriendsPage({
  ssgMd = Boolean(import.meta.env.SSG_MD)
}: {
  ssgMd?: boolean
} = {}): ReactElement {
  const { title, intro, exchange, friends } = friendsData
  const isClient = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  )
  const ordered = useMemo(() => (isClient ? shuffle(friends) : friends), [friends, isClient])

  return (
    <div className='friends rp-not-doc font-[family-name:var(--rp-font-family-base)] text-[var(--rp-c-text-1)]'>
      <header className='border-b border-[var(--rp-c-divider-light)] pb-8'>
        {ssgMd ? null : <h1 className={headingClass}>{title}</h1>}
        <p className='mt-3 mb-0 text-base leading-relaxed text-[var(--rp-c-text-2)]'>{intro}</p>
        {ssgMd ? null : (
          <p className='mt-[0.45rem] mb-0 font-[family-name:var(--rp-font-family-mono)] text-[0.78rem] tracking-[0.02em] text-[var(--rp-c-text-2)]'>
            Shuffled on each visit — say hi in a new order.
          </p>
        )}
      </header>

      {ordered.length === 0 ? (
        <p className='friends-empty mt-8 mb-0 rounded-[var(--rp-radius-small)] border border-dashed border-[var(--rp-c-divider)] bg-[var(--rp-c-bg-soft)] px-[1.05rem] py-4 leading-[1.7] text-[var(--rp-c-text-2)]'>
          No friends listed yet. Check back after the first exchange.
        </p>
      ) : (
        <ul className='friends-grid mt-8 mb-0 grid list-none grid-cols-[repeat(auto-fill,minmax(15.5rem,1fr))] gap-3 p-0'>
          {ordered.map(friend => (
            <FriendCard key={friend.url} friend={friend} ssgMd={ssgMd} />
          ))}
        </ul>
      )}

      <section className='friends-exchange mt-11 border-t border-[var(--rp-c-divider-light)] pt-8'>
        <h2 className={sectionHeadingClass}>{exchange.title}</h2>
        <p className='m-0 leading-[1.7] text-[var(--rp-c-text-2)]'>{exchange.body}</p>
        {ssgMd ? (
          <ul>
            <li>{`Name: ${exchange.self.name}`}</li>
            <li>
              Site:{' '}
              <a className={linkClass} href={exchange.self.url}>
                {exchange.self.url}
              </a>
            </li>
            <li>
              Avatar:{' '}
              <a className={linkClass} href={exchange.self.avatar}>
                {exchange.self.avatar}
              </a>
            </li>
            <li>{`Blurb: ${exchange.self.desc}`}</li>
          </ul>
        ) : (
          <div className='mt-5 flex flex-col items-start gap-4 rounded-[var(--rp-radius-small)] border border-[var(--rp-c-divider-light)] bg-[var(--rp-c-bg-soft)] px-[1.05rem] py-4 sm:flex-row'>
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
              <div className='grid grid-cols-1 items-baseline gap-x-3 gap-y-[0.15rem] sm:grid-cols-[4.5rem_1fr] sm:gap-y-2'>
                <dt className='m-0 font-[family-name:var(--rp-font-family-mono)] text-[0.72rem] font-medium tracking-[0.06em] text-[var(--rp-c-text-2)] uppercase'>
                  Name
                </dt>
                <dd className='m-0 text-[0.92rem] leading-normal text-[var(--rp-c-text-1)] wrap-anywhere'>
                  {exchange.self.name}
                </dd>
              </div>
              <div className='grid grid-cols-1 items-baseline gap-x-3 gap-y-[0.15rem] sm:grid-cols-[4.5rem_1fr] sm:gap-y-2'>
                <dt className='m-0 font-[family-name:var(--rp-font-family-mono)] text-[0.72rem] font-medium tracking-[0.06em] text-[var(--rp-c-text-2)] uppercase'>
                  Site
                </dt>
                <dd className='m-0 text-[0.92rem] leading-normal text-[var(--rp-c-text-1)] wrap-anywhere'>
                  <a className={linkClass} href={exchange.self.url}>
                    {exchange.self.url}
                  </a>
                </dd>
              </div>
              <div className='grid grid-cols-1 items-baseline gap-x-3 gap-y-[0.15rem] sm:grid-cols-[4.5rem_1fr] sm:gap-y-2'>
                <dt className='m-0 font-[family-name:var(--rp-font-family-mono)] text-[0.72rem] font-medium tracking-[0.06em] text-[var(--rp-c-text-2)] uppercase'>
                  Avatar
                </dt>
                <dd className='m-0 text-[0.92rem] leading-normal text-[var(--rp-c-text-1)] wrap-anywhere'>
                  <a className={linkClass} href={exchange.self.avatar}>
                    {exchange.self.avatar}
                  </a>
                </dd>
              </div>
              <div className='grid grid-cols-1 items-baseline gap-x-3 gap-y-[0.15rem] sm:grid-cols-[4.5rem_1fr] sm:gap-y-2'>
                <dt className='m-0 font-[family-name:var(--rp-font-family-mono)] text-[0.72rem] font-medium tracking-[0.06em] text-[var(--rp-c-text-2)] uppercase'>
                  Blurb
                </dt>
                <dd className='m-0 text-[0.92rem] leading-normal text-[var(--rp-c-text-1)] wrap-anywhere'>
                  {exchange.self.desc}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </section>
    </div>
  )
}
