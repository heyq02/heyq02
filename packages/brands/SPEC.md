---
id: brands
type: module-design
status: draft
title: Skills picture URL
parent: architecture
---

## Responsibility

Build the shared simpleicons.dev skills picture URL from skills that already carry a simple-icons `icon` slug. Display names stay for `alt` text; this package does not map brand names to slugs.

## Boundary

- No dependency on `profile` or on the `simple-icons` package. Callers pass `{ name, icon }`.
- `readme` and `site` both use `skillIconsPicture`. Neither may build its own simpleicons.dev URL or keep a name→slug table.
- A skill with an empty `icon` is left out of the picture.
- Private workspace package. Source is the export; it is not packed to `dist/`.
