/** Shared class tokens — colors/type/radius/shadow from Rspress via Tailwind @theme. */

export const sitePageRoot = 'rp-not-doc font-sans text-rp-text'

export const siteH1 = 'm-0 text-rp-hero font-bold leading-tight tracking-tight text-rp-text'

export const siteH2 =
  "m-0 mb-rp-4 text-rp-xl font-[650] leading-snug text-rp-text after:mt-rp-2 after:block after:h-0.5 after:w-8 after:bg-rp-brand after:content-['']"

export const siteLink =
  'font-semibold text-inherit no-underline hover:text-rp-link hover:underline hover:underline-offset-[3px]'

/** Soft surface shell (radius + border + fill). */
export const siteSurface = 'rounded-rp-sm border border-rp-divider-light bg-rp-soft'

/** Static soft panel (exchange block, empty states share padding/radius). */
export const sitePanelChrome = `${siteSurface} px-rp-4 py-rp-4`

/** Interactive card chrome shared by project/post/friend cards. */
export const siteCardChrome = `${sitePanelChrome} font-normal text-inherit !no-underline transition-[border-color,background-color,box-shadow] duration-200 hover:border-rp-brand hover:bg-rp-bg hover:text-inherit hover:shadow-rp hover:!no-underline`

/** Linkable soft tile without default padding (likes grids). */
export const siteTile = `${siteSurface} no-underline transition-[border-color,background-color,box-shadow] duration-200 hover:border-rp-brand hover:!no-underline`

export const siteCardName =
  'text-rp-lg font-[650] leading-snug text-rp-text transition-colors duration-200 group-hover:text-rp-brand'

export const siteCardSummary = 'text-rp-md font-normal leading-relaxed text-rp-muted'

export const siteWhen = 'm-0 whitespace-nowrap font-mono text-rp-sm font-medium text-rp-muted'

export const siteMeta = 'font-mono text-rp-sm font-medium tracking-wide text-rp-muted'

export const siteEmpty =
  'm-0 rounded-rp-sm border border-dashed border-rp-divider bg-rp-soft px-rp-4 py-rp-4 leading-relaxed text-rp-muted'

export const siteSection = 'mt-rp-10'

export const siteHeaderRule = 'border-b border-rp-divider-light pb-rp-8'

export const siteBody = 'm-0 text-rp-md leading-relaxed text-rp-muted'

export const siteBadge =
  'inline-flex items-center rounded-full border border-rp-divider-light bg-rp-bg px-rp-2 py-px text-rp-xs leading-none text-rp-muted'

export const siteDisplay = 'font-bold tracking-tight text-rp-text text-rp-2xl'

export const siteProgressTrack = 'overflow-hidden rounded-full bg-rp-divider-light'

export const siteProgressFill = 'block h-full rounded-full bg-rp-brand'
