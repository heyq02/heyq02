---
id: rspress-plugin-profile
type: module-design
status: draft
title: 首页简介插件
parent: architecture
depends-on: [shared, rspress-plugin-github-pins]
---

## Responsibility

在路由扫描前把 `blogs/index.mdx` 生成为中文个人主页：`ProfilePlay` 组件承载头像与角色标签，随后依次是教育经历、工作经历、开源项目与技能图（标题取 `intro.json` 的 `sections`）。置顶项目由 `rspress-plugin-github-pins` 提供，计数用 `formatCount` 缩写。

项目简介一律使用仓库在 GitHub 上的 `description` 原文，不翻译、不维护本地中英对照表：改文案就去改仓库描述。

## Boundary

- 可依赖 `shared` 与 `rspress-plugin-github-pins`。不得导入 `site` 或渲染博客内容。
- 只生成一个文件（`blogs/index.mdx`），没有语言维度；标题后缀由角色标签与 `intro.bio` 拼成。
- 项目名、简介、语言、星标与派生全部来自 GraphQL 响应；`intro.json` 不参与项目卡片。
- 内容用 `writeIfChanged` 写入，无变化时不触发 `vp fmt`。

## Testing

- 单测覆盖率至少 95%（语句、分支、函数、行）。
- 必须有独立的 `e2e/` 套件；通过根目录 `pnpm test:e2e` 运行。
