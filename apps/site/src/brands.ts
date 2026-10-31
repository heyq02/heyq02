/** Resolve `@heyq02/brands` slugs to `simple-icons` objects for the site UI. */

import { brandSlug, matchBrandName } from '@heyq02/brands'
import type { SimpleIcon } from 'simple-icons'
import * as simpleIcons from 'simple-icons'

function isSimpleIcon(value: unknown): value is SimpleIcon {
  return (
    typeof value === 'object' &&
    value !== null &&
    'slug' in value &&
    'path' in value &&
    typeof (value as SimpleIcon).slug === 'string'
  )
}

const iconsBySlug = new Map(
  Object.values(simpleIcons)
    .filter(isSimpleIcon)
    .map(icon => [icon.slug, icon])
)

export function brandIcon(label: string): SimpleIcon | undefined {
  const name = matchBrandName(label)
  if (name === undefined) {
    return undefined
  }

  const slug = brandSlug(name)
  return slug === undefined ? undefined : iconsBySlug.get(slug)
}
