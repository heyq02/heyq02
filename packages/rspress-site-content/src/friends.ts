export interface FriendLink {
  name: string
  url: string
  avatar: string
  /** Optional one-line blurb; omit when the friend has none. */
  desc?: string
}

export interface FriendsData {
  title: string
  intro: string
  friends: FriendLink[]
}

/** Raw `content/data/friends.json`. */
export interface FriendsJson {
  title: string
  intro: string
  friends: FriendLink[]
}

/** Normalize friends JSON into page data. */
export function buildFriendsData(raw: FriendsJson): FriendsData {
  return {
    title: raw.title,
    intro: raw.intro,
    friends: raw.friends
  }
}
