import type { SocialLink } from '@rspress/core'

import intro from '../../../static/data/intro.json' with { type: 'json' }

function iconFor(label: string): SocialLink['icon'] | undefined {
  switch (label) {
    case 'GitHub': {
      return 'github'
    }
    case 'Bluesky': {
      return 'bluesky'
    }
    case 'Bilibili': {
      return 'bilibili'
    }
    case 'Juejin': {
      return 'juejin'
    }
    case 'WeChat': {
      return 'wechat'
    }
    default: {
      return undefined
    }
  }
}

const emailIcon =
  '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2.4.3 7.1 5.1a.8.8 0 0 0 .9 0l7.2-5.1a.5.5 0 0 0-.3-.8h-14a.5.5 0 0 0-.3.8Z"/></svg>'

const phoneIcon =
  '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M7.5 3.5h2.2c.4 0 .8.3.9.7l.8 2.6a1 1 0 0 1-.3 1L9.6 9.4a12.5 12.5 0 0 0 5 5l1.6-1.5a1 1 0 0 1 1-.3l2.6.8c.4.1.7.5.7.9v2.2a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 6 5.1a1.5 1.5 0 0 1 1.5-1.6Z"/></svg>'

export function socialLinksFrom(
  places: typeof intro.places,
  contact = intro.contact
): SocialLink[] {
  const links: SocialLink[] = []
  for (const place of places) {
    const icon = iconFor(place.label)
    if (!icon) {
      continue
    }
    links.push({
      icon,
      mode: place.href.startsWith('/') ? 'img' : 'link',
      content: place.href
    })
  }

  links.push(
    { icon: { svg: emailIcon }, mode: 'link', content: `mailto:${contact.email}` },
    { icon: { svg: phoneIcon }, mode: 'text', content: contact.phone }
  )
  return links
}

export function socialLinks() {
  return socialLinksFrom(intro.places)
}
