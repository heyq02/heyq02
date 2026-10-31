import data from '../../../static/data/friends.json' with { type: 'json' }

export interface FriendLink {
  name: string
  blog: string
  url: string
  avatar: string
  desc: string
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
