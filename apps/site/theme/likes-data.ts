import type { LikesCategoryId, LikesData, Shelf } from '@heyq02/content'

import data from '../../../static/data/likes.json' with { type: 'json' }

export type {
  LikesCategory,
  LikesCategoryId,
  LikesData,
  MusicPlaylist,
  MusicShelf,
  MusicTrack,
  Shelf,
  ShelfItem,
  ShelfSection
} from '@heyq02/content'

const raw = data satisfies LikesData

export const likesData: LikesData = raw

export function shelfOf(id: Exclude<LikesCategoryId, 'music'>): Shelf {
  return likesData[id]
}
