import type { ReactElement } from 'react'

import type { LikesCategoryId } from './likes-data.ts'
import { Hub } from './likes/Hub.tsx'
import { MusicPage } from './likes/MusicPage.tsx'
import { ReadingPage } from './likes/ReadingPage.tsx'
import { UsesPage } from './likes/UsesPage.tsx'
import { VisitsPage } from './likes/VisitsPage.tsx'
import { WatchingPage } from './likes/WatchingPage.tsx'

/** Route each interest category to its own layout language. */
export function LikesPage({
  category = 'hub',
  ssgMd = Boolean(import.meta.env.SSG_MD)
}: {
  category?: 'hub' | LikesCategoryId
  ssgMd?: boolean
} = {}): ReactElement {
  switch (category) {
    case 'uses': {
      return <UsesPage ssgMd={ssgMd} />
    }
    case 'music': {
      return <MusicPage ssgMd={ssgMd} />
    }
    case 'watching': {
      return <WatchingPage ssgMd={ssgMd} />
    }
    case 'visits': {
      return <VisitsPage ssgMd={ssgMd} />
    }
    case 'reading': {
      return <ReadingPage ssgMd={ssgMd} />
    }
    default: {
      return <Hub ssgMd={ssgMd} />
    }
  }
}
