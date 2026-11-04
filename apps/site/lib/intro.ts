/** Typed SSOT over `static/data/intro.json` for the site's identity facts. */
import type { Intro } from '@heyq02/rspress-plugin-profile'

import raw from '../../../static/data/intro.json' with { type: 'json' }

export type {
  Contact,
  Education,
  Experience,
  Intro,
  Place,
  Skill
} from '@heyq02/rspress-plugin-profile'

export const intro: Intro = raw
