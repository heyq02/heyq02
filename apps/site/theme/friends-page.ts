import { buildFriendsData } from '@heyq02/rspress-site-content'
import type { FriendsData, FriendsJson } from '@heyq02/rspress-site-content'

import data from '../../../content/data/friends.json' with { type: 'json' }

export type { FriendLink, FriendsData } from '@heyq02/rspress-site-content'

const raw = data satisfies FriendsJson

/** Friends page data. */
export const friendsData: FriendsData = buildFriendsData(raw)
