---
id: shared
type: module-design
status: draft
title: Shared app helpers
parent: architecture
---

## Responsibility

Cross-app helpers used by more than one workspace app. Today that is typed access to `static/data/intro.json` (`intro`, `Intro`, `formatCount`), the shared simpleicons.dev skills picture URL (`skillIconsPicture`), and navbar social-link mapping (`socialLinksFrom`).

## Boundary

- May read `static/data/intro.json`. No dependency on `site`, `readme`, `cli`, or `@rspress/core`.
- `site` and `readme` both use `skillIconsPicture` and `intro`. Neither may build its own simpleicons.dev URL or keep a name→slug table.
- A skill with an empty `icon` is left out of the picture.
- `socialLinksFrom` maps intro `places` into navbar link items; the site Rspress config calls it with `intro.places` from JSON.
- Public surface is `intro` / `Intro` / `formatCount` / `skillIconsPicture` / `socialLinksFrom` / `SocialLinkItem`. Other types stay package-internal.
- Private workspace package. Source is the export; it is not packed to `dist/`.

## Testing

- Unit coverage at least 95% (statements, branches, functions, lines).
- Independent `e2e/` suite required; run via root `pnpm test:e2e`.
