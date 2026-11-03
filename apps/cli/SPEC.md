---
id: cli
type: module-design
status: draft
title: Terminal README
parent: architecture
---

## Responsibility

已发布到 npm 的可执行程序 `heyq02`。每次调用都拉取 `main` 上的原始 README 并按终端样式渲染输出。所有参数（包括 `-h` 与 `-v`）都被忽略。拉取失败、超时或响应非 OK 时写入 stderr 并以非零码退出。

## Boundary

- 只允许拉取 `https://raw.githubusercontent.com/heyq02/heyq02/main/README.md`。超时 10 秒。不访问 `site`、不访问 `shared`、不访问其他网络。没有 help 或 version 命令。
- 不拉取 blob 页面——那是 GitHub 的 HTML，不是 README 文件。
- `marked-terminal` 原样渲染拉取到的文件。README 是 Markdown，因此本 app 不改写 HTML。
- CLI 入口判断用 `realpath` 解析 `process.argv[1]`，以便 npm/npx 的 `.bin` 软链接仍能匹配 `import.meta.url`。
- 输出是终端文本，不绘制技能图。

## Testing

- 单测覆盖率至少 95%（语句、分支、函数、行）。
- 必须有独立的 `e2e/` 套件；通过根目录 `pnpm test:e2e` 运行。
