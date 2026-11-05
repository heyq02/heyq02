import { assertIntro } from '@heyq02/rspress-site-content'

import data from '../../../content/data/intro.json' with { type: 'json' }

export type { Contact, HomePlace, Intro, Place } from '@heyq02/rspress-site-content'

export const intro = assertIntro(data)
