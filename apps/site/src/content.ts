import { absoluteHref, intro } from '@heyq02/profile'

function linked<T extends { href: string }>(item: T): T {
  return { ...item, href: absoluteHref(item.href) }
}

/** English profile for the homepage. Relative links are already absolute. */
export const content = {
  ...intro,
  names: [...intro.names],
  sections: { ...intro.sections },
  places: intro.places.map(linked),
  skills: intro.skills.map(linked),
  skipToContent: 'Skip to content'
}
