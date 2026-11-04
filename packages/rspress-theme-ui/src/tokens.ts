/** Shared class tokens — colors/type/radius/shadow from Rspress via site Tailwind @theme. */

export const sitePageRoot = 'rp-not-doc font-sans text-rp-text'

export const siteH1 =
  'm-0 font-display text-rp-hero font-bold leading-[1.15] tracking-tight text-rp-text'

export const siteH2 =
  "m-0 mb-rp-4 font-display text-rp-xl font-[650] leading-snug text-rp-text after:mt-rp-2 after:block after:h-0.5 after:w-8 after:bg-rp-brand after:content-['']"

/** Keyboard focus ring — every interactive control should include this. */
export const siteFocusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rp-brand'

export const siteLink = `font-semibold text-inherit no-underline hover:text-rp-link hover:underline hover:underline-offset-[3px] ${siteFocusRing}`

/** Soft surface shell — dashed panel used across the site. */
export const siteSurface = 'rounded-2xl border border-dashed border-rp-divider bg-rp-bg'

/** Static soft panel (empty states share padding/radius). */
export const sitePanelChrome = `${siteSurface} px-rp-4 py-rp-4`

/** Interactive card chrome shared by project/post/friend cards. */
export const siteCardChrome = `${sitePanelChrome} font-normal text-inherit !no-underline transition-[border-color,background-color,transform] duration-200 hover:-translate-y-px hover:border-rp-brand hover:bg-rp-soft hover:text-inherit hover:!no-underline ${siteFocusRing}`

export const siteCardName =
  'font-display text-rp-lg font-[650] leading-snug text-rp-text transition-colors duration-200 group-hover:text-rp-brand'

export const siteCardSummary = 'text-rp-md font-normal leading-relaxed text-rp-muted'

export const siteWhen = 'm-0 whitespace-nowrap font-mono text-rp-sm font-medium text-rp-muted'

export const siteMeta = 'font-mono text-rp-sm font-medium tracking-wide text-rp-muted'

export const siteEmpty =
  'm-0 rounded-2xl border border-dashed border-rp-divider bg-rp-soft px-rp-4 py-rp-4 leading-relaxed text-rp-muted'

export const siteSection = 'mt-rp-10'

export const siteHeaderRule = 'border-b border-rp-divider-light pb-rp-8'

export const siteBody = 'm-0 text-rp-md leading-relaxed text-rp-muted'
