import { intro } from '@heyq02/shared'

import data from '../../../static/data/friends.json' with { type: 'json' }

export interface FriendLink {
  name: string
  url: string
  avatar: string
  /** Optional one-line blurb; omit when the friend has none. */
  desc?: string
}

export interface FriendsData {
  title: string
  kicker: string
  intro: string
  exchange: {
    title: string
    body: string
    self: FriendLink
  }
  friends: FriendLink[]
}

interface FriendsJson {
  title: string
  kicker: string
  intro: string
  exchange: {
    title: string
    /** May include `{email}`; filled from intro.contact.email. */
    body: string
    /** Blurb only; name/url/avatar come from intro. */
    self: { desc: string }
  }
  friends: FriendLink[]
}

const raw = data satisfies FriendsJson

/** Friends page data with identity fields taken from intro SSOT. */
export const friendsData: FriendsData = {
  title: raw.title,
  kicker: raw.kicker,
  intro: raw.intro,
  exchange: {
    title: raw.exchange.title,
    body: raw.exchange.body.replaceAll('{email}', intro.contact.email),
    self: {
      name: intro.name,
      url: intro.site,
      avatar: intro.avatar,
      desc: raw.exchange.self.desc
    }
  },
  friends: raw.friends
}
