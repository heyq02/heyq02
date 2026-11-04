import { buildFriendsData } from '@heyq02/rspress-site-content'
import type { FriendsData, FriendsJson } from '@heyq02/rspress-site-content'

import data from '../../../static/data/friends.json' with { type: 'json' }
import { intro } from '../lib/intro.ts'

export type { FriendLink, FriendsData } from '@heyq02/rspress-site-content'

const raw = data satisfies FriendsJson

/** Friends page data with identity fields taken from intro SSOT. */
export const friendsData: FriendsData = buildFriendsData(intro, raw)
