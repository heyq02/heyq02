import type { SocialLink } from '@rspress/core'

import intro from '../../../static/data/intro.json' with { type: 'json' }

const navbarOrder = ['GitHub', 'Bluesky', 'Twitter', 'Bilibili', 'WeChat'] as const

const icons: Record<(typeof navbarOrder)[number], SocialLink['icon']> = {
  GitHub: 'github',
  Bluesky: 'bluesky',
  Twitter: 'x',
  Bilibili: 'bilibili',
  WeChat: 'wechat'
}

export function socialLinksFrom(places: typeof intro.places): SocialLink[] {
  const byLabel = new Map(places.map(place => [place.label, place]))
  const links: SocialLink[] = []
  for (const label of navbarOrder) {
    const place = byLabel.get(label)
    if (!place) {
      continue
    }
    const icon = icons[label]
    links.push({
      icon,
      mode: place.href.startsWith('/') ? 'img' : 'link',
      content: place.href
    })
  }
  return links
}

export function socialLinks() {
  return socialLinksFrom(intro.places)
}
