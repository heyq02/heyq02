---
id: readme
type: module-design
status: draft
title: README generator
parent: architecture
depends-on: [brands]
---

## Responsibility

Write the repository `README.md` as Markdown the terminal can render directly: a heading greeting with role tags, experience (`###` company links, dates, bullets), and one skills image. It does not use HTML, so it does not switch that image with `prefers-color-scheme`.

It does not emit places, pinned projects, writing, bio, or Chinese. The release workflow runs this against `main` and commits only `README.md` (`architecture`).

## Boundary

- May depend on `brands` and `ejs`, and may read `static/data/intro.json` directly. Must not import `site`.
- The Markdown layout lives in an EJS template. This app fills it; it does not assemble the README string in code. `<%-` is used so intro text is not HTML-escaped.
- This app reads `intro.json` directly: its build is `node --experimental-strip-types`.
- Skill badges use `skillIconsPicture` with each skill's `icon` slug. A skill with an empty `icon` is left out of the picture.
