import {
  CardLink,
  CardSummary,
  CardTitle,
  Empty,
  PageShell,
  Panel,
  Section,
  TextLink,
  siteBody,
  siteCardChrome,
  siteMeta
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
  'block size-12 shrink-0 rounded-full border border-rp-divider-light bg-rp-bg object-cover'

const fieldLabelClass = `m-0 uppercase ${siteMeta}`

const fieldValueClass = 'm-0 text-rp-md leading-normal text-rp-text wrap-anywhere'

const fieldRowClass =
  'grid grid-cols-1 items-baseline gap-x-rp-3 gap-y-rp-1 sm:grid-cols-[4.5rem_1fr] sm:gap-y-rp-2'

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
        className={`gap-rp-3 flex h-full items-center ${siteCardChrome}`}
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
        <span className='gap-rp-1 grid min-w-0'>
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
  const { title, exchange, friends } = friendsData
  const isClient = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  )
  const ordered = useMemo(() => (isClient ? shuffle(friends) : friends), [friends, isClient])

  return (
    <PageShell title={title} ssgMd={ssgMd} tone='friends'>
      {ordered.length === 0 ? (
        <Empty className='friends-empty mt-rp-10'>还没有友链，等第一位朋友来交换。</Empty>
      ) : (
        <ul className='friends-grid mt-rp-10 gap-rp-3 mb-0 grid list-none grid-cols-[repeat(auto-fill,minmax(15.5rem,1fr))] p-0'>
          {ordered.map(friend => (
            <FriendCard key={friend.url} friend={friend} ssgMd={ssgMd} />
          ))}
        </ul>
      )}

      <Section
        marker='friends-exchange'
        className='border-rp-divider-light pt-rp-8 border-t'
        title={exchange.title}
      >
        <p className={siteBody}>{exchange.body}</p>
        {ssgMd ? (
          <ul>
            <li>{`名称：${exchange.self.name}`}</li>
            <li>
              站点：
              <TextLink href={exchange.self.url}>{exchange.self.url}</TextLink>
            </li>
            <li>
              头像：
              <TextLink href={exchange.self.avatar}>{exchange.self.avatar}</TextLink>
            </li>
            <li>{`简介：${exchange.self.desc}`}</li>
          </ul>
        ) : (
          <Panel className='mt-rp-5 gap-rp-4 flex flex-col items-start sm:flex-row'>
            <img
              className={avatarClass}
              src={exchange.self.avatar}
              alt=''
              width={48}
              height={48}
              loading='lazy'
              decoding='async'
            />
            <dl className='gap-rp-2 m-0 grid min-w-0'>
              <div className={fieldRowClass}>
                <dt className={fieldLabelClass}>名称</dt>
                <dd className={fieldValueClass}>{exchange.self.name}</dd>
              </div>
              <div className={fieldRowClass}>
                <dt className={fieldLabelClass}>站点</dt>
                <dd className={fieldValueClass}>
                  <TextLink href={exchange.self.url}>{exchange.self.url}</TextLink>
                </dd>
              </div>
              <div className={fieldRowClass}>
                <dt className={fieldLabelClass}>头像</dt>
                <dd className={fieldValueClass}>
                  <TextLink href={exchange.self.avatar}>{exchange.self.avatar}</TextLink>
                </dd>
              </div>
              <div className={fieldRowClass}>
                <dt className={fieldLabelClass}>简介</dt>
                <dd className={fieldValueClass}>{exchange.self.desc}</dd>
              </div>
            </dl>
          </Panel>
        )}
      </Section>
    </PageShell>
  )
}
