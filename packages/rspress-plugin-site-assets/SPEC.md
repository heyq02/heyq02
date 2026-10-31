---
id: rspress-plugin-site-assets
type: module-design
status: draft
title: Site public assets plugin
parent: architecture
---

## Responsibility

Copy signature favicons and the WeChat QR into `blogs/public` before Rspress serves/builds.

## Boundary

- Reads `static/signature/` (relative to the monorepo via `siteRoot`) and `apps/site/public/wechat.jpg`. Does not generate MDX or meta JSON.
