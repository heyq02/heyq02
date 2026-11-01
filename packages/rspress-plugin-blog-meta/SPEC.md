---
id: rspress-plugin-blog-meta
type: module-design
status: draft
title: Blog sidebar meta plugin
parent: architecture
depends-on: [shared]
---

## Responsibility

Scan Markdown under `blog/posts/` and `blog/interview/`, and write Rspress sidebar `_meta.json` for `/blog/`, `/blog/posts/`, and `/blog/interview/` (date-desc). Exports `listBlogPosts` for the profile homepage Writing section (posts only — interview notes stay off the homepage). Written `_meta.json` files are gitignored site outputs.

## Boundary

- May depend on `@heyq02/shared` (`formatGenerated`, `writeIfChanged`). Must not render homepage MDX or call GitHub.

## Testing

- Unit coverage at least 95% (statements, branches, functions, lines).
- Independent `e2e/` suite required; run via root `pnpm test:e2e`.
