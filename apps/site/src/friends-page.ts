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

export const friendsData = data satisfies FriendsData

export function friendsList(): FriendLink[] {
  return friendsData.friends
}
