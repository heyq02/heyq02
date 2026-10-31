/**
 * Shared Tailwind tokens for profile + friends surfaces.
 * Keep `rspress-plugin-profile/src/profile-classes.ts` in sync with these strings.
 */

export const sitePageRoot =
  'rp-not-doc font-[family-name:var(--rp-font-family-base)] text-[var(--rp-c-text-1)]'

export const siteH1 =
  'm-0 text-[clamp(2.1rem,5.5vw,2.75rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--rp-c-text-1)]'

export const siteH2 =
  "m-0 mb-4 text-[1.25rem] font-[650] leading-[1.3] text-[var(--rp-c-text-1)] after:mt-2 after:block after:h-0.5 after:w-8 after:bg-[var(--rp-c-brand)] after:content-['']"

export const siteLink =
  'font-semibold text-inherit no-underline hover:text-[var(--rp-c-link)] hover:underline hover:underline-offset-[3px]'

/** Static soft panel (exchange block, empty states share padding/radius). */
export const sitePanelChrome =
  'rounded-[var(--rp-radius-small)] border border-[var(--rp-c-divider-light)] bg-[var(--rp-c-bg-soft)] px-[1.05rem] py-4'

/** Interactive card chrome shared by project/post/friend cards. */
export const siteCardChrome = `${sitePanelChrome} font-normal text-inherit !no-underline transition-[border-color,background-color,box-shadow] duration-200 hover:border-[var(--rp-c-brand)] hover:bg-[var(--rp-c-bg)] hover:text-inherit hover:shadow-[var(--rp-shadow-1)] hover:!no-underline`

export const siteCardName =
  'text-[1.02rem] font-[650] leading-[1.35] text-[var(--rp-c-text-1)] transition-colors duration-200 group-hover:text-[var(--rp-c-brand)]'

export const siteCardSummary =
  'text-[0.95rem] font-normal leading-relaxed text-[var(--rp-c-text-2)]'

export const siteWhen =
  'm-0 whitespace-nowrap font-[family-name:var(--rp-font-family-mono)] text-[0.78rem] font-medium text-[var(--rp-c-text-2)]'

export const siteEmpty =
  'm-0 rounded-[var(--rp-radius-small)] border border-dashed border-[var(--rp-c-divider)] bg-[var(--rp-c-bg-soft)] px-[1.05rem] py-4 leading-[1.7] text-[var(--rp-c-text-2)]'

export const siteSection = 'mt-10'

export const siteHeaderRule = 'border-b border-[var(--rp-c-divider-light)] pb-8'

export const siteBody = 'm-0 text-[0.95rem] leading-[1.7] text-[var(--rp-c-text-2)]'
