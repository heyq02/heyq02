---
id: rspress-plugin-blog-meta
type: module-design
status: draft
title: 博客侧边栏 meta 插件
parent: architecture
depends-on: [shared]
---

## Responsibility

扫描 `blog/posts/` 与 `blog/interview/` 下的 Markdown，为 `/blog/`、`/blog/posts/`、`/blog/interview/` 写入 Rspress 侧边栏 `_meta.json`（按日期倒序）。同时导出 `listBlogPosts` / `listInterviewNotes` 供需要这些列表的调用方使用。写出的 `_meta.json` 是被 gitignore 的站点产物。侧边栏标签为中文：概览、文章、面经。

## Boundary

- 可依赖 `@heyq02/shared`（`formatGenerated`、`writeIfChanged`）。不得渲染首页 MDX，也不调用 GitHub。
- 只处理单一日志树 `apps/site/blogs/blog`，没有语言参数。

## Testing

- 单测覆盖率至少 95%（语句、分支、函数、行）。
- 必须有独立的 `e2e/` 套件；通过根目录 `pnpm test:e2e` 运行。
