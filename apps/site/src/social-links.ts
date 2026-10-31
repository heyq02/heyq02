import type { SocialLink } from '@rspress/core'

interface PlaceLike {
  label: string
  href: string
}

const navbarOrder = ['GitHub', 'Bluesky', 'X', 'Bilibili', 'WeChat'] as const

const icons: Record<(typeof navbarOrder)[number], SocialLink['icon']> = {
  GitHub: 'github',
  Bluesky: 'bluesky',
  X: 'x',
  Bilibili: 'bilibili',
  WeChat: 'wechat'
}

/** Build navbar social links from intro places (caller supplies places; no JSON read here). */
export function socialLinksFrom(places: readonly PlaceLike[]): SocialLink[] {
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
