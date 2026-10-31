import { useMemo, useSyncExternalStore } from 'react'
import type { ReactElement } from 'react'

import { friendsData } from '../src/friends-page.ts'
import type { FriendLink } from '../src/friends-page.ts'

function friendLabel(friend: FriendLink): string {
  return friend.desc ? `${friend.name} · ${friend.desc}` : friend.name
}

function shuffle<T>(items: T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const left = next[i]
    const right = next[j]
    if (left === undefined || right === undefined) {
      continue
    }
    next[i] = right
    next[j] = left
  }
  return next
}

function subscribeNever(): () => void {
  return () => {}
}

function FriendCard({ friend }: { friend: FriendLink }): ReactElement {
  // Prefer readable link text for SSG-MD Agents over avatar+span chrome.
  if (import.meta.env.SSG_MD) {
    return (
      <li>
        <a href={friend.url}>{friend.name}</a>
        {friend.desc ? ` — ${friend.desc}` : null}
      </li>
    )
  }

  return (
    <li className='friends-item'>
      <a
        className='friends-card'
        href={friend.url}
        target='_blank'
        rel='noopener noreferrer friend'
        title={friend.name}
        aria-label={friendLabel(friend)}
      >
        <img
          className='friends-avatar'
          src={friend.avatar}
          alt=''
          width={48}
          height={48}
          loading='lazy'
          decoding='async'
        />
        <span className='friends-card-copy'>
          <span className='friends-card-name'>{friend.name}</span>
          {friend.desc ? <span className='friends-card-desc'>{friend.desc}</span> : null}
        </span>
      </a>
    </li>
  )
}

/** Avatar + name + desc grid; client shuffle like YunYouJun's links page. */
export function FriendsPage(): ReactElement {
  const { title, kicker, intro, exchange, friends } = friendsData
  const isClient = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  )
  const ordered = useMemo(() => (isClient ? shuffle(friends) : friends), [friends, isClient])

  return (
    <div className='friends rp-not-doc'>
      <header className='friends-hero'>
        <p className='friends-kicker'>{kicker}</p>
        {import.meta.env.SSG_MD ? null : <h1>{title}</h1>}
        <p className='friends-intro'>{intro}</p>
        {import.meta.env.SSG_MD ? null : (
          <p className='friends-shuffle-hint'>Shuffled on each visit — say hi in a new order.</p>
        )}
      </header>

      {ordered.length === 0 ? (
        <p className='friends-empty'>No friends listed yet. Check back after the first exchange.</p>
      ) : (
        <ul className='friends-grid'>
          {ordered.map(friend => (
            <FriendCard key={friend.url} friend={friend} />
          ))}
        </ul>
      )}

      <section className='friends-exchange'>
        <h2>{exchange.title}</h2>
        <p>{exchange.body}</p>
        {import.meta.env.SSG_MD ? (
          <ul>
            <li>{`Name: ${exchange.self.name}`}</li>
            <li>
              Site: <a href={exchange.self.url}>{exchange.self.url}</a>
            </li>
            <li>
              Avatar: <a href={exchange.self.avatar}>{exchange.self.avatar}</a>
            </li>
            <li>{`Blurb: ${exchange.self.desc}`}</li>
          </ul>
        ) : (
          <div className='friends-self'>
            <img
              className='friends-avatar'
              src={exchange.self.avatar}
              alt=''
              width={48}
              height={48}
              loading='lazy'
              decoding='async'
            />
            <dl className='friends-self-meta'>
              <div>
                <dt>Name</dt>
                <dd>{exchange.self.name}</dd>
              </div>
              <div>
                <dt>Site</dt>
                <dd>
                  <a href={exchange.self.url}>{exchange.self.url}</a>
                </dd>
              </div>
              <div>
                <dt>Avatar</dt>
                <dd>
                  <a href={exchange.self.avatar}>{exchange.self.avatar}</a>
                </dd>
              </div>
              <div>
                <dt>Blurb</dt>
                <dd>{exchange.self.desc}</dd>
              </div>
            </dl>
          </div>
        )}
      </section>
    </div>
  )
}
