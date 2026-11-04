/** Shared Tailwind class tokens for profile + friends UI. */

export const sitePageRoot =
  'mx-auto w-full max-w-[44rem] font-[family-name:var(--site-font)] text-[var(--site-text-1)]'

export const siteH1 =
  'm-0 text-[clamp(2.1rem,5.5vw,2.75rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--site-text-1)]'

export const siteH2 =
  "m-0 mb-4 text-[1.25rem] font-[650] leading-[1.3] text-[var(--site-text-1)] after:mt-2 after:block after:h-0.5 after:w-8 after:bg-[var(--site-brand)] after:content-['']"

export const siteLink =
  'font-semibold text-inherit no-underline hover:text-[var(--site-link)] hover:underline hover:underline-offset-[3px]'

/** Static soft panel (exchange block, empty states share padding/radius). */
export const sitePanelChrome =
  'rounded-[var(--site-radius-small)] border border-[var(--site-divider-light)] bg-[var(--site-bg-soft)] px-[1.05rem] py-4'

/** Interactive card chrome shared by project/post/friend cards. */
export const siteCardChrome = `${sitePanelChrome} font-normal text-inherit !no-underline transition-[border-color,background-color,box-shadow] duration-200 hover:border-[var(--site-brand)] hover:bg-[var(--site-bg)] hover:text-inherit hover:shadow-[var(--site-shadow-1)] hover:!no-underline`

export const siteCardName =
  'text-[1.02rem] font-[650] leading-[1.35] text-[var(--site-text-1)] transition-colors duration-200 group-hover:text-[var(--site-brand)]'

export const siteCardSummary =
  'text-[0.95rem] font-normal leading-relaxed text-[var(--site-text-2)]'

export const siteWhen =
  'm-0 whitespace-nowrap font-[family-name:var(--site-mono)] text-[0.78rem] font-medium text-[var(--site-text-2)]'

export const siteEmpty =
  'm-0 rounded-[var(--site-radius-small)] border border-dashed border-[var(--site-divider)] bg-[var(--site-bg-soft)] px-[1.05rem] py-4 leading-[1.7] text-[var(--site-text-2)]'

export const siteSection = 'mt-10'

export const siteHeaderRule = 'border-b border-[var(--site-divider-light)] pb-8'

export const siteBody = 'm-0 text-[0.95rem] leading-[1.7] text-[var(--site-text-2)]'

export const profileH3 = 'm-0 text-[1.05rem] font-semibold leading-[1.4]'

export const profileList =
  'mt-[0.7rem] mb-0 list-disc pl-5 leading-[1.7] text-[var(--site-text-2)] [&_li+li]:mt-[0.35rem]'

export const profileSection = 'profile-section mt-10'

export const profileJob =
  'profile-job relative pl-[1.1rem] before:absolute before:top-[0.35rem] before:bottom-[0.2rem] before:left-0 before:w-0.5 before:rounded-full before:bg-[var(--site-brand)] [&+.profile-job]:mt-6'

export const profileJobHead =
  'profile-job-head flex flex-wrap items-baseline justify-between gap-x-4 gap-y-[0.35rem]'

export const profileEduMeta =
  'profile-edu-meta mt-[0.55rem] mb-0 text-[0.95rem] leading-relaxed text-[var(--site-text-2)]'

export const profileCard = `profile-project group grid gap-[0.55rem] ${siteCardChrome}`

export const profileCardTop = 'grid gap-2'

export const profileCounts = 'profile-counts m-0 flex flex-wrap gap-[0.35rem]'

export const profileGrid = 'grid gap-3'

export const profileSkills = 'profile-skills m-0'

export const profileSkillsImg = 'block h-auto max-w-full dark:invert'

export const badgeClass =
  'inline-flex items-center rounded-full border border-[var(--site-divider-light)] bg-[var(--site-bg-soft)] px-2.5 py-0.5 text-[0.78rem] font-medium text-[var(--site-text-2)]'
