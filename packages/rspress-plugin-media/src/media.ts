import { readFile } from 'node:fs/promises'

import type { SocialLink } from '@rspress/core'
import type { SimpleIcon } from 'simple-icons'
import * as simpleIcons from 'simple-icons'
import { parse } from 'smol-toml'

export interface MediaEntry {
  name: string
  aliases?: string[]
  url: string
  id?: string
  visible?: boolean
  desc?: string
  /** Simple-icons slug; required for navbar social links. */
  simpleicon?: string
  mode?: SocialLink['mode']
}

export type MediaTable = Record<string, MediaEntry>

const iconBySlug = new Map<string, SimpleIcon>()
for (const value of Object.values(simpleIcons)) {
  if (typeof value !== 'object' || !('slug' in value) || !('svg' in value)) {
    continue
  }
  iconBySlug.set(value.slug, value)
}

/** Parse a `personal/media.toml`-shaped document into keyed entries. */
export function parseMediaToml(source: string): MediaTable {
  return parse(source) as unknown as MediaTable
}

/** Load and parse media.toml from disk. */
export async function loadMediaTable(mediaPath: string): Promise<MediaTable> {
  return parseMediaToml(await readFile(mediaPath, 'utf8'))
}

/** Resolve a simple-icons SVG and force `fill="currentColor"` for theme chrome. */
export function svgForSimpleIcon(slug: string): string {
  const icon = iconBySlug.get(slug)
  if (!icon) {
    throw new Error(`@heyq02/rspress-plugin-media: unknown simpleicon slug "${slug}"`)
  }

  const { svg } = icon
  if (/\bfill="/.test(svg)) {
    return svg.replaceAll(/\bfill="[^"]*"/g, 'fill="currentColor"')
  }
  return svg.replace('<svg', '<svg fill="currentColor"')
}

function socialMode(entry: MediaEntry): SocialLink['mode'] {
  if (entry.mode) {
    return entry.mode
  }
  return entry.url.startsWith('/') ? 'img' : 'link'
}

/** Visible media rows with a simpleicon + URL → Rspress `themeConfig.socialLinks`. */
export function socialLinksFromMediaTable(table: MediaTable): SocialLink[] {
  const links: SocialLink[] = []
  for (const entry of Object.values(table)) {
    if (entry.visible === false) {
      continue
    }
    if (!entry.simpleicon || !entry.url) {
      continue
    }
    links.push({
      icon: { svg: svgForSimpleIcon(entry.simpleicon) },
      mode: socialMode(entry),
      content: entry.url
    })
  }
  return links
}

/** Read media.toml and build Rspress socialLinks (icon.svg from simple-icons). */
export async function socialLinksFromMedia(mediaPath: string): Promise<SocialLink[]> {
  return socialLinksFromMediaTable(await loadMediaTable(mediaPath))
}
