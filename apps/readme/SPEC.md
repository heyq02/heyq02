---
id: readme
type: module-design
status: draft
title: README generator
parent: architecture
depends-on: [brands]
---

## Responsibility

Write the repository `README.md`: a Chinese greeting and experience, the skills picture once (it switches simple-icons theme with `prefers-color-scheme`), a horizontal rule, then the English greeting and experience. The English block does not repeat the picture.

It does not emit places, projects, or bio. The release workflow runs this against `main` and commits only `README.md` (`architecture`).

## Boundary

- May depend on `brands` and may read `static/data/intro.json` and `static/data/intro.zh.json` directly. Must not import `site` or `profile`. A Chinese experience list that does not match English is an error, same rule as `profile`.
- Inferred, not confirmed: `profile` exports `dist/`, and this app's build is `node --experimental-strip-types` with no dependency build, so it cannot rely on that output. That is why it reads the JSON files instead of the merge.
- Skill badges use `brandSlug` only. A skill with no slug is left out of the picture. This app must not grow its own slug map.
