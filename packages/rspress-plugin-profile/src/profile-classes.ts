/** Marker-prefixed class strings for generated homepage MDX — Rspress tokens via site Tailwind @theme. */

const sitePageRoot = 'rp-not-doc font-sans text-rp-text'

const siteH2 =
  "m-0 mb-rp-4 text-rp-xl font-[650] leading-snug text-rp-text after:mt-rp-2 after:block after:h-0.5 after:w-8 after:bg-rp-brand after:content-['']"

const siteLink =
  'font-semibold text-inherit no-underline hover:text-rp-link hover:underline hover:underline-offset-[3px]'

const sitePanelChrome = 'rounded-rp-sm border border-rp-divider-light bg-rp-soft px-rp-4 py-rp-4'

const siteCardChrome = `${sitePanelChrome} font-normal text-inherit !no-underline transition-[border-color,background-color,box-shadow] duration-200 hover:border-rp-brand hover:bg-rp-bg hover:text-inherit hover:shadow-rp hover:!no-underline`

const siteCardName =
  'text-rp-lg font-[650] leading-snug text-rp-text transition-colors duration-200 group-hover:text-rp-brand'

const siteCardSummary = 'text-rp-md font-normal leading-relaxed text-rp-muted'

const siteWhen = 'm-0 whitespace-nowrap font-mono text-rp-sm font-medium text-rp-muted'

export const profileCardName = siteCardName
export const profileCardSummary = siteCardSummary
export const profileH2 = siteH2
export const profileLink = siteLink

export const profileRoot = `profile ${sitePageRoot}`

export const profileH3 = 'm-0 text-rp-lg font-semibold leading-snug'

export const profileList =
  'mt-rp-3 mb-0 list-disc pl-rp-5 leading-relaxed text-rp-muted [&_li+li]:mt-rp-1'

export const profileSection = 'profile-section mt-rp-10'

export const profileWhen = `profile-when ${siteWhen}`

export const profileJob =
  'profile-job relative pl-rp-5 before:absolute before:top-rp-1 before:bottom-rp-1 before:left-0 before:w-0.5 before:rounded-full before:bg-rp-brand [&+.profile-job]:mt-rp-6'

export const profileJobHead =
  'profile-job-head flex flex-wrap items-baseline justify-between gap-x-rp-4 gap-y-rp-1'

export const profileEduMeta =
  'profile-edu-meta mt-rp-2 mb-0 text-rp-md leading-relaxed text-rp-muted'

export const profileCard = `profile-project group grid gap-rp-2 ${siteCardChrome} [&_.rp-badge]:no-underline`

export const profileCardTop = 'grid gap-rp-2'

export const profileCounts = 'profile-counts m-0 flex flex-wrap gap-rp-1'

export const profileGrid = 'grid gap-rp-3'

export const profileSkills = 'profile-skills m-0'

export const profileSkillsImg = 'block h-auto max-w-full dark:invert'
