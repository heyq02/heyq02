interface PlaceLike {
  label: string
  href: string
}

export interface SocialLinkItem {
  icon: 'github' | 'x' | 'bilibili' | 'wechat'
  mode: 'img' | 'link'
  content: string
}

const navbarOrder = ['GitHub', 'X', 'Bilibili', 'WeChat'] as const

const icons: Record<(typeof navbarOrder)[number], SocialLinkItem['icon']> = {
  GitHub: 'github',
  X: 'x',
  Bilibili: 'bilibili',
  WeChat: 'wechat'
}

/** Build navbar social links from intro places (caller supplies places; no JSON read here). */
export function socialLinksFrom(places: readonly PlaceLike[]): SocialLinkItem[] {
  const byLabel = new Map(places.map(place => [place.label, place]))
  const links: SocialLinkItem[] = []
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
