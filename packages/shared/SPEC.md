---
id: shared
type: module-design
status: draft
title: Shared app helpers
parent: architecture
---

## Responsibility

Cross-app helpers used by more than one workspace package. Typed access to `static/data/intro.json` (`intro`, `Intro`, `formatCount`), the shared simpleicons.dev skills picture URL (`skillIconsPicture`), navbar social-link mapping (`socialLinksFrom`), site UI Tailwind tokens (`siteH1` / `siteCardChrome` / …), and generated-file helpers (`formatGenerated`, `writeIfChanged`).

## Boundary

- May read `static/data/intro.json`. No dependency on `site`, `readme`, `cli`, or `@rspress/core`.
- `site` and `readme` both use `skillIconsPicture` and `intro`. Neither may build its own simpleicons.dev URL or keep a name→slug table.
- A skill with an empty `icon` is left out of the picture.
- `socialLinksFrom` maps intro `places` into navbar link items; the site Rspress config calls it with `intro.places` from JSON.
- Theme and profile plugin consume the same `site-*` UI tokens; profile adds marker prefixes in `profile-classes.ts`.
- Browser-safe public surface is `intro` / `Intro` / `formatCount` / `skillIconsPicture` / `socialLinksFrom` / `SocialLinkItem` / site UI tokens. Node-only `formatGenerated` / `writeIfChanged` / `SpawnFn` export from `@heyq02/shared/fs`.
- Private workspace package. Source is the export; it is not packed to `dist/`.

## Testing

- Unit coverage at least 95% (statements, branches, functions, lines).
- Independent `e2e/` suite required; run via root `pnpm test:e2e`.
