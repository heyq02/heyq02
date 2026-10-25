import type { CSSProperties } from 'react'
import type { SimpleIcon } from 'simple-icons'

interface BrandIconProps {
  icon: SimpleIcon
  colorOnHover?: boolean
  colored?: boolean
  size?: 'sm' | 'md'
}

export function BrandIcon({
  icon,
  colorOnHover = false,
  colored = false,
  size = 'sm'
}: BrandIconProps) {
  const sizeClass = size === 'md' ? 'size-5' : 'size-3.5'

  return (
    <svg
      aria-hidden='true'
      className={colorOnHover ? `skill-brand ${sizeClass} shrink-0` : `${sizeClass} shrink-0`}
      fill={colored ? `#${icon.hex}` : colorOnHover ? undefined : 'currentColor'}
      style={colorOnHover ? ({ '--brand': `#${icon.hex}` } as CSSProperties) : undefined}
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
    >
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  )
}
