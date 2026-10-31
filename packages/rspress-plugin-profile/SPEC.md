---
id: rspress-plugin-profile
type: module-design
status: draft
title: Profile homepage MDX plugin
parent: architecture
depends-on: [shared, rspress-plugin-blog-meta, rspress-plugin-github-pins]
---

## Responsibility

Render `blogs/index.mdx` (education, experience, open source, skills, writing) from intro + blog posts + GitHub pins. `profilePlayModule` defaults to `@theme/ProfilePlay`.

## Boundary

- Depends on `shared`, `rspress-plugin-blog-meta` (`listBlogPosts`), and `rspress-plugin-github-pins` (`fetchPinnedProjects`). Does not write blog `_meta.json` or copy public assets.

## Testing

- Unit coverage at least 95% (statements, branches, functions, lines).
- Independent `e2e/` suite required; run via root `pnpm test:e2e`.
