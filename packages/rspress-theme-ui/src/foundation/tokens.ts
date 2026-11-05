/** Shared class tokens — colors / type / space via Rspress + `--hey-space-*` CSS vars. */

export const sitePageRoot = 'rp-not-doc font-sans text-[var(--rp-c-text-1)]'

export const siteH1 =
  'm-0 font-display text-[clamp(2.1rem,5.5vw,2.75rem)] font-bold leading-[1.15] tracking-tight text-[var(--rp-c-text-1)]'

export const siteH2 =
  "m-0 mb-[var(--hey-space-lg,var(--rp-radius))] font-display text-[1.25rem] font-[650] leading-snug text-[var(--rp-c-text-1)] after:mt-[var(--hey-space-sm,var(--rp-radius-small))] after:block after:h-0.5 after:w-8 after:bg-[var(--rp-c-brand)] after:content-['']"

/** Keyboard focus ring — every interactive control should include this. */
export const siteFocusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--rp-c-brand)]'

export const siteLink = `font-semibold text-inherit no-underline hover:text-[var(--rp-c-link)] hover:underline hover:underline-offset-[3px] ${siteFocusRing}`

/** Soft surface shell — dashed panel used across the site. */
export const siteSurface =
  'rounded-2xl border border-dashed border-[var(--rp-c-divider)] bg-[var(--rp-c-bg)]'

/** Static soft panel (empty states share padding/radius). */
export const sitePanelChrome = `${siteSurface} px-[var(--hey-space-lg,var(--rp-radius))] py-[var(--hey-space-lg,var(--rp-radius))]`

/** Interactive card chrome shared by project/post/friend cards. */
export const siteCardChrome = `${sitePanelChrome} font-normal text-inherit !no-underline transition-[border-color,background-color,transform] duration-200 hover:-translate-y-px hover:border-[var(--rp-c-brand)] hover:bg-[var(--rp-c-bg-soft)] hover:text-inherit hover:!no-underline ${siteFocusRing}`

export const siteCardName =
  'font-display text-[1.125rem] font-[650] leading-snug text-[var(--rp-c-text-1)] transition-colors duration-200 group-hover:text-[var(--rp-c-brand)]'

export const siteCardSummary = 'text-[1rem] font-normal leading-relaxed text-[var(--rp-c-text-2)]'

export const siteWhen =
  'm-0 whitespace-nowrap font-mono text-[length:var(--rp-code-font-size)] font-medium text-[var(--rp-c-text-2)]'

export const siteMeta =
  'font-mono text-[length:var(--rp-code-font-size)] font-medium tracking-wide text-[var(--rp-c-text-2)]'

export const siteEmpty =
  'm-0 rounded-2xl border border-dashed border-[var(--rp-c-divider)] bg-[var(--rp-c-bg-soft)] px-[var(--hey-space-lg,var(--rp-radius))] py-[var(--hey-space-lg,var(--rp-radius))] leading-relaxed text-[var(--rp-c-text-2)]'

/** Block / page section top gap (`--hey-space-3xl`). */
export const siteSection = 'mt-[var(--hey-space-3xl,calc(var(--rp-radius-small)*5))]'

export const siteHeaderRule =
  'border-b border-[var(--rp-c-divider-light)] pb-[var(--hey-space-xl,calc(var(--rp-radius)*2))]'

export const siteBody = 'm-0 text-[1rem] leading-relaxed text-[var(--rp-c-text-2)]'

/** Compact control padding (mood / reshuffle buttons). */
export const siteControlPad =
  'px-[var(--hey-space-2xs,calc(var(--rp-radius-small)/2))] py-[var(--hey-space-2xs,calc(var(--rp-radius-small)/2))]'

/** Pill / CTA vertical padding. */
export const sitePillPadY = 'py-[var(--hey-space-xs,calc(var(--rp-radius-small)*0.75))]'
