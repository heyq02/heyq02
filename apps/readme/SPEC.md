---
id: readme
type: module-design
status: draft
title: README 生成器
parent: architecture
depends-on: [shared]
---

## Responsibility

把仓库 `README.md` 写为终端可直接渲染的 Markdown：中文问候标题、角色标签、工作经历（`###` 公司链接、起止时间、要点列表）和一张技能图。不使用 HTML，因此该图也不会随 `prefers-color-scheme` 切换。

不输出 places、置顶项目、bio。发布流水线在 `main` 上运行它，只提交 `README.md`（`architecture`）。

## Boundary

- 可依赖 `shared` 与 `ejs`。不得导入 `site`。
- Markdown 版式放在 EJS 模板里，本 app 只负责填充，不在代码里拼字符串。使用 `<%-` 以免简介文本被 HTML 转义。
- 身份事实与技能图来自 `shared`（`intro`、`skillIconsPicture`）。构建命令是 `node --experimental-strip-types`。
- `icon` 为空的技能不会出现在图里。
- 提交到根目录的 `README.md` 必须与 `renderReadme()` 一致，由 readme 测试锁定。

## Testing

- 单测覆盖率至少 95%（语句、分支、函数、行）。
- 必须有独立的 `e2e/` 套件；通过根目录 `pnpm test:e2e` 运行。
