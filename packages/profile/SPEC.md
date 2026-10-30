---
id: profile
type: module-design
status: draft
title: Profile data
parent: architecture
---

## Responsibility

Typed API over the English profile in `static/data/intro.json`. Callers get the intro fields, places and skills with relative links absolutized, a terminal-oriented `profile` view, and `formatCount` / `fullName` / `absoluteHref`.

It does not translate, render, or choose icons. Chinese copy is not its job (`site`).

## Boundary

- May read `static/data/intro.json` and nothing else in the repo. No dependency on `brands`, `site`, `cli`, or `readme`.
- Not the only reader of that file. The site Vite config and `readme` read it directly (`architecture`). This package owns the typed contract, not exclusive file access.
- The terminal `profile` view drops `languageColor`. Other exports keep the JSON shape.
- Private workspace package. It is built to `dist/` because the CLI bundles that output.
