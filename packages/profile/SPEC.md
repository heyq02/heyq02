---
id: profile
type: module-design
status: draft
title: Profile data
parent: architecture
---

## Responsibility

Typed API over the English profile in `static/data/intro.json`. Callers get `intro`, places and skills with relative links absolutized, `formatCount` / `fullName` / `absoluteHref`, and a convenience `profile` object for tests and local inspection. Each skill includes a simple-icons `icon` slug for the shared skills picture.

It does not render or choose icons. It does not translate. It does not list Open source projects; the site loads pinned GitHub repositories at prepare time. The published CLI does not import this package; it prints the GitHub README (`architecture`, `cli`).

`bio` / `contact` stay in the JSON as identity facts; the navbar omits email and phone. `kaomoji` / `moods` feed the homepage poke-to-cycle face. `bio` also feeds the console greeting. Name, site, avatar, and email are the SSOT for Friends exchange identity fields too.

## Boundary

- May read `static/data/intro.json` and nothing else in the repo. No dependency on `brands`, `site`, `cli`, or `readme`.
- Not the only reader of that file. The site Rspress config and `readme` read it directly (`architecture`). This package owns the typed contract, not exclusive file access.
- Private workspace package. It is built to `dist/` because the site imports that output.
