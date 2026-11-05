/**
 * Layered theme UI:
 * - foundation — cx + design tokens
 * - primitives — atomic links / text / empty
 * - layout — page chrome (shell, section, jump rail)
 * - widgets — composed pieces (icons, weather, heatmap)
 * - blocks — page-level sections (profile hero)
 *
 * Public API stays flat for `@heyq02/rspress-theme-ui` consumers.
 */

export {
  cx,
  siteBody,
  siteCardChrome,
  siteCardName,
  siteCardSummary,
  siteEmpty,
  siteFocusRing,
  siteH1,
  siteH2,
  siteHeaderRule,
  siteLink,
  siteMeta,
  sitePageRoot,
  sitePanelChrome,
  siteSection,
  siteSurface,
  siteWhen
} from './foundation/index.ts'

export { CardLink, CardSummary, CardTitle, Empty, TextLink } from './primitives/index.ts'

export { JumpRail, PageShell, Section } from './layout/index.ts'

export { ContributionHeatmap, HomeWeather, SocialIcons } from './widgets/index.ts'
export type { SocialIconsProps } from './widgets/index.ts'

export { ProfileHero } from './blocks/index.ts'
export type { ProfileHeroProps } from './blocks/index.ts'
