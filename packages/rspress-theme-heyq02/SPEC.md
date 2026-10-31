---
id: rspress-theme-heyq02
type: module-design
status: draft
title: heyq02 Rspress theme
parent: architecture
depends-on: [shared]
---

## Responsibility

Custom Rspress theme for heyq02.com: `Layout` (site footer + console greeting), `ProfilePlay`, `FriendsPage`, and minimal `chrome.css` (dark logo invert; hide doc chrome on `.profile` / `.friends`). Component and MDX styling is Tailwind utilities from the site `globalStyles` entry. `themeDir` in the site config points at this package directory.

## Boundary

- May depend on `shared` and peer `@rspress/core` / React. Must not depend on site plugins or `readme` / `cli`.
- Friends page data lives here (`friends-page.ts` + `static/data/friends.json`). Identity fields still come from intro via `shared`.
- Theme entry re-exports `@rspress/core/theme-original`. Components used from MDX are imported via `@theme/...`.

## Testing

- Unit coverage at least 95% (statements, branches, functions, lines).
- Independent `e2e/` suite required; run via root `pnpm test:e2e`.
