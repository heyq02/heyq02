---
id: brands
type: module-design
status: draft
title: Brand name map
parent: architecture
---

## Responsibility

Map a display name to a [simple-icons](https://simpleicons.org) slug, and recognize a label that is exactly that name or starts with the name plus a space or fullwidth parenthesis.

Some names are matchable and have no slug (`Taro`, `Rspack`). Matching them must not invent a slug.

## Boundary

- No dependency on `profile` or on the `simple-icons` package. This module returns strings, not icon objects.
- `readme` uses `skillIconsPicture` for the skills image. `site` uses the slug map for individual icons and must not keep a second name→slug table or build its own simpleicons.dev URL.
- A label that matches no name is unknown. Callers decide whether to hide the link or show text.
- Private workspace package. Source is the export; it is not packed to `dist/`.
