/** Typed SSOT over `content/data/intro.json` for the site's identity facts. */
import type { Intro } from '@heyq02/rspress-site-content'

import raw from '../../../content/data/intro.json' with { type: 'json' }

export type { Contact, HomePlace, Intro, Place, Skill } from '@heyq02/rspress-site-content'

export const intro: Intro = raw
