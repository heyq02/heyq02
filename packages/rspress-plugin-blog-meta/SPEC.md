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
