export interface FriendLink {
  name: string
  url: string
  avatar: string
  /** Optional one-line blurb; omit when the friend has none. */
  desc?: string
}

export interface FriendsData {
  title: string
  friends: FriendLink[]
}
