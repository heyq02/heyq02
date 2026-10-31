---
id: site-content
type: module-design
status: draft
title: Site content generation
parent: architecture
depends-on: [shared]
---

## Responsibility

Homepage/blog content-generation pipeline for the profile site: list Markdown posts, fetch GitHub pinned projects, render homepage MDX, and write blog `_meta.json` plus public asset copies (`prepareSite`).

## Boundary

- May depend on `shared` and `@octokit/graphql`. Must not depend on `site`, `readme`, or `cli`.
- Does not own Rspress config or theme. The site app registers a thin `pluginPrepareSite` shim that calls `prepareSiteOnce` with the site root and ProfilePlay import path.
- `renderHomeMdx` accepts `profilePlayModule` so the MDX import stays relative to `apps/site/blogs/index.mdx`.
- Private workspace package. Source is the export; it is not packed to `dist/`.
