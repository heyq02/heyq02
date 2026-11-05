import type { FriendsData } from '@heyq02/rspress-site-content'

import data from '../../../content/data/friends.json' with { type: 'json' }

export type { FriendLink, FriendsData } from '@heyq02/rspress-site-content'

/** Friends page data. */
export const friendsData: FriendsData = data
