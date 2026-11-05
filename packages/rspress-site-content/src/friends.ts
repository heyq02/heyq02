export interface FriendLink {
  name: string
  url: string
  avatar: string
  /** Optional one-line blurb; omit when the friend has none. */
  desc?: string
}

/** Copy for the friend-link application block (Giscus comments). */
export interface FriendsApply {
  title: string
  intro: string
}

export interface FriendsData {
  title: string
  /** Optional apply section shown above Giscus on the friends page. */
  apply?: FriendsApply
  friends: FriendLink[]
}
