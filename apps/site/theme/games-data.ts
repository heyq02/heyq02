import type { GamesData } from '@heyq02/rspress-site-content'

import data from '../../../content/data/games.json' with { type: 'json' }

export type { GameProfile, GamesData } from '@heyq02/rspress-site-content'

export const gamesData: GamesData = data
