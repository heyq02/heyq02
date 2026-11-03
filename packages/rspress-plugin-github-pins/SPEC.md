---
id: rspress-plugin-github-pins
type: module-design
status: draft
title: GitHub 置顶项目库
parent: architecture
depends-on: [shared]
---

## Responsibility

通过 Octokit GraphQL 拉取 GitHub 主页置顶仓库（`GITHUB_TOKEN` / `GH_TOKEN`，10 秒超时）。作为库被 `rspress-plugin-profile` 调用，本包不作为 Rspress 插件注册。

## Boundary

- 可依赖 `@heyq02/shared`（`intro`）获取 GitHub 用户名。不得写站点文件。
- 用户名取自 intro 的 `places`（GitHub 项）。

## Limitations

没有 token 时拉取会失败。限流与 GraphQL 错误会抛给调用方。

## Testing

- 单测覆盖率至少 95%（语句、分支、函数、行）。
- 必须有独立的 `e2e/` 套件；通过根目录 `pnpm test:e2e` 运行。
