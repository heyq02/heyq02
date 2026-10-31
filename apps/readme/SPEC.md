---
id: readme
type: module-design
status: draft
title: README generator
parent: architecture
depends-on: [brands]
---

## Responsibility

Write the repository `README.md`: an h1 greeting, the experience section (linked company, dates, bullets), and a skills picture that switches simple-icons theme with `prefers-color-scheme`.

It does not emit places, projects, bio, or Chinese. The release workflow runs this against `main` and commits only `README.md` (`architecture`).

## Boundary

- May depend on `brands` and may read `static/data/intro.json` directly. Must not import `site`, `profile`, or `intro.zh.json`.
- Inferred, not confirmed: `profile` exports `dist/`, and this app's build is `node --experimental-strip-types` with no dependency build, so it cannot rely on that output. That is why it reads the English JSON directly.
- Skill badges use `brandSlug` only. A skill with no slug is left out of the picture. This app must not grow its own slug map.
