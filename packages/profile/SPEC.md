---
id: profile
type: module-design
status: draft
title: Profile data
parent: architecture
---

## Responsibility

Typed API over the English profile in `static/data/intro.json` and the Chinese overlay in `static/data/intro.zh.json`. Callers get the English intro, a merged Chinese intro, places and skills with relative links absolutized, a terminal-oriented `profile` view, and `formatCount` / `fullName` / `absoluteHref`.

It does not render or choose icons. The overlay supplies the alias, degree, city, bio, kicker, description, section labels, place details, experience company / end / points, and skill and project summaries. The display name, title, links, start dates, counts, and skill names stay on the English intro, so renaming there updates both locales. The alias is the second typed name, not a replacement for the display name.

## Boundary

- May read `static/data/intro.json` and `static/data/intro.zh.json`, and nothing else in the repo. No dependency on `brands`, `site`, `cli`, or `readme`.
- A Chinese list whose length does not match English is an error. A new job, place, skill, or project cannot ship in one language only.
- Not a private site table. The site runtime imports this merge. The CLI does not read this package. README stays English and must not read the overlay (`architecture`).
- Not the only reader of those files. The site Vite config reads them for shell meta because it must not import this package (`architecture`). This package owns the typed contract, not exclusive file access.
- The terminal `profile` view drops `languageColor`. Other exports keep the JSON shape.
- Private workspace package. It is built to `dist/` because the CLI bundles that output.
