---
id: rspress-theme-heyq02
type: module-design
status: draft
title: heyq02 Rspress 主题
parent: architecture
depends-on: [shared]
---

## Responsibility

heyq02.com 的自定义 Rspress 主题：`Layout`（站点页脚 + 控制台问候）、`ProfilePlay`、`FriendsPage`、从 `@heyq02/shared` 重新导出的 `ui-classes.ts` 站点 UI token，以及少量 `chrome.css`（暗色 logo 反色；把 `.profile` / `.friends` 居中并约束到同样的 44rem 宽度；隐藏 `.rp-llms-container`）。简介/友链页面使用 `pageType: doc-wide` 且 `sidebar`/`outline: false`，站点 `fallbackHeadingTitle: false`。组件与 MDX 样式来自站点 `globalStyles` 入口的 Tailwind 工具类。站点配置的 `themeDir` 指向本包目录。

界面文案为中文：头像与表情按钮的 `aria-label`/`title`、控制台问候、友链空状态、「每次访问都会重新排序」提示、交换友链字段名（名称/站点/头像/简介）以及 SSG-MD 的文本版本。

## Boundary

- 可依赖 `shared` 与 peer `@rspress/core` / React。不得依赖站点插件或 `readme` / `cli`。
- 友链页面数据放在本包（`friends-page.ts` + `static/data/friends.json`）。身份字段仍来自 `shared` 的 intro。
- 主题入口重新导出 `@rspress/core/theme-original`。MDX 中使用的组件通过 `@theme/...` 导入。

## Testing

- 单测覆盖率至少 95%（语句、分支、函数、行）。
- 必须有独立的 `e2e/` 套件；通过根目录 `pnpm test:e2e` 运行。
