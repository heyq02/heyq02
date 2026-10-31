---
id: profile
type: module-design
status: draft
title: Profile data
parent: architecture
---

## Responsibility

Typed API over the English profile in `static/data/intro.json`. Callers get the intro fields, places and skills with relative links absolutized, a terminal-oriented `profile` view, and `formatCount` / `fullName` / `absoluteHref`.

It does not render or choose icons. It does not translate. It does not list open-source projects; the site loads pinned GitHub repositories at prepare time.

## Boundary

- May read `static/data/intro.json` and nothing else in the repo. No dependency on `brands`, `site`, `cli`, or `readme`.
- Not the only reader of that file. The site Rspress config and `readme` read it directly (`architecture`). This package owns the typed contract, not exclusive file access.
- Private workspace package. It is built to `dist/` because the site imports that output.
