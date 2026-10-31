---
id: shared
type: module-design
status: draft
title: Shared app helpers
parent: architecture
---

## Responsibility

Cross-app helpers used by more than one workspace app. Today that is typed access to `static/data/intro.json` (`intro`, `Intro`, `formatCount`) and the shared simpleicons.dev skills picture URL (`skillIconsPicture`).

## Boundary

- May read `static/data/intro.json`. No dependency on `site`, `readme`, or `cli`.
- `site` and `readme` both use `skillIconsPicture` and `intro`. Neither may build its own simpleicons.dev URL or keep a name→slug table.
- A skill with an empty `icon` is left out of the picture.
- Public surface is `intro` / `Intro` / `formatCount` / `skillIconsPicture`. Other types stay package-internal.
- Private workspace package. Source is the export; it is not packed to `dist/`.
