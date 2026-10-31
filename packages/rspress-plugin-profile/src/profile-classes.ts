/** Marker-prefixed class strings for generated homepage MDX (tokens from `@heyq02/shared`). */

import { siteCardChrome, siteEmpty, sitePageRoot, siteWhen } from '@heyq02/shared'

export {
  siteCardName as profileCardName,
  siteCardSummary as profileCardSummary,
  siteH2 as profileH2,
  siteLink as profileLink
} from '@heyq02/shared'

export const profileRoot = `profile ${sitePageRoot}`

export const profileH3 = 'm-0 text-[1.05rem] font-semibold leading-[1.4]'

export const profileList =
  'mt-[0.7rem] mb-0 list-disc pl-5 leading-[1.7] text-[var(--rp-c-text-2)] [&_li+li]:mt-[0.35rem]'

export const profileSection = 'profile-section mt-10'

export const profileWriting = `${profileSection} profile-writing`

export const profileWhen = `profile-when ${siteWhen}`

export const profileJob =
  'profile-job relative pl-[1.1rem] before:absolute before:top-[0.35rem] before:bottom-[0.2rem] before:left-0 before:w-0.5 before:rounded-full before:bg-[var(--rp-c-brand)] [&+.profile-job]:mt-6'

export const profileJobHead =
  'profile-job-head flex flex-wrap items-baseline justify-between gap-x-4 gap-y-[0.35rem]'

export const profileEduMeta =
  'profile-edu-meta mt-[0.55rem] mb-0 text-[0.95rem] leading-relaxed text-[var(--rp-c-text-2)]'

export const profileCard = `profile-project group grid gap-[0.55rem] ${siteCardChrome} [&_.rp-badge]:no-underline`

export const profilePost = `profile-post group grid gap-[0.55rem] ${siteCardChrome} [&_.rp-badge]:no-underline`

export const profileCardTop = 'grid gap-2'

export const profileCounts = 'profile-counts m-0 flex flex-wrap gap-[0.35rem]'

export const profileGrid = 'grid gap-3'

export const profileSkills = 'profile-skills m-0'

export const profileSkillsImg = 'block h-auto max-w-full dark:invert'

export const profilePlaceholder = `profile-placeholder ${siteEmpty}`
