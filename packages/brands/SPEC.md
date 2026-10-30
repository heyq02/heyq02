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
- `site` resolves a slug to an icon object. `readme` puts slugs in `simpleicons.dev` badge URLs. Neither may keep a second name→slug table.
- A label that matches no name is unknown. Callers decide whether to hide the link or show text.
- Private workspace package. Source is the export; it is not packed to `dist/`.
