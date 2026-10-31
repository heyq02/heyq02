---
id: rspress-plugin-blog-meta
type: module-design
status: draft
title: Blog sidebar meta plugin
parent: architecture
---

## Responsibility

Scan Markdown posts and write Rspress sidebar `_meta.json` for `/blog/` and `/blog/posts/`. Also exports `listBlogPosts` for the profile homepage Writing section.

## Boundary

- No dependency on `shared` or GitHub. Must not render homepage MDX.

## Testing

- Unit coverage at least 95% (statements, branches, functions, lines).
- Independent `e2e/` suite required; run via root `pnpm test:e2e`.
