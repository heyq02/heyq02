export interface LikesCategory {
  id: string
  title: string
  desc: string
  href: string
  countLabel: string
}

export interface ShelfItem {
  title: string
  href?: string
  cover?: string
  score?: number
  year?: number
  subtitle?: string
  label?: string
  note?: string
  tags?: string[]
  /** Uses: monogram on the desk card. */
  mark?: string
  /** Reading: 0–100 progress for current books. */
  progress?: number
  /** Visits: venue city / host. */
  place?: string
  /** Visits: ticket date label. */
  date?: string
}

export interface ShelfSection {
  id: string
  title: string
  items: ShelfItem[]
}

export interface Shelf {
  title: string
  intro: string
  sections: ShelfSection[]
}

export interface MusicTrack {
  rank: number
  title: string
  artist: string
  album: string
  cover: string
  plays: number
  href?: string
}

export interface MusicPlaylist {
  title: string
  desc: string
  cover: string
  trackCount: number
  href?: string
}

export interface MusicShelf {
  title: string
  intro: string
  listening: {
    title: string
    period: string
    updatedAt: string
    tracks: MusicTrack[]
  }
  playlists: MusicPlaylist[]
}

export interface LikesData {
  title: string
  intro: string
  categories: LikesCategory[]
  uses: Shelf
  watching: Shelf
  reading: Shelf
  visits: Shelf
  music: MusicShelf
}

export type LikesCategoryId = 'uses' | 'watching' | 'reading' | 'visits' | 'music'
