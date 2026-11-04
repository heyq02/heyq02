---
id: shared
type: module-design
status: draft
title: 跨 app 共享辅助
parent: architecture
---

## Responsibility

被多个 workspace 包使用的共享辅助。对 `static/data/intro.json` 的类型化访问（`intro`、`Intro`、`formatCount`）、共享 simpleicons.dev 技能图 URL（`skillIconsPicture`）、导航栏社交链接映射（`socialLinksFrom`）、站点 UI Tailwind token（`siteH1` / `siteCardChrome` / …）以及生成文件辅助（`formatGenerated`、`writeIfChanged`）。

## Boundary

- 可读取 `static/data/intro.json`。不依赖 `site`、`readme`、`cli` 或 `@rspress/core`。
- `site` 与 `readme` 都用 `skillIconsPicture` 与 `intro`。二者不得自行拼接 simpleicons.dev URL，也不得维护 name→slug 表。
- `icon` 为空的技能不会出现在图里。
- `socialLinksFrom` 把 intro 的 `places` 映射为导航栏链接项；站点 Rspress 配置用 JSON 中的 `intro.places` 调用它。
- intro 只放身份事实（姓名、经历、教育、技能、社交）；置顶项目的文案归 GitHub 仓库描述所有，不在此维护副本。
- 主题与 profile 插件共用同一批 `site-*` UI token；profile 在 `profile-classes.ts` 中加上 marker 前缀。
- 浏览器安全对外面：`intro` / `Intro` / `formatCount` / `skillIconsPicture` / `socialLinksFrom` / `SocialLinkItem` / 站点 UI token。仅 Node 可用的 `formatGenerated` / `writeIfChanged` / `SpawnFn` 从 `@heyq02/shared/fs` 导出。
- 私有 workspace 包。源码即导出，不打包到 `dist/`。

## Testing

- 单测覆盖率至少 95%（语句、分支、函数、行）。
- 必须有独立的 `e2e/` 套件；通过根目录 `pnpm test:e2e` 运行。
