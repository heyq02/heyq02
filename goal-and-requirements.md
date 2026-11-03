---
id: goal
type: goal-and-requirements
status: draft
title: Ari He｜阿瑞 个人主页
---

## Goal

本仓库是 Ari He｜阿瑞的公开主页：一个中文个人站点、一个打印 GitHub README 的 CLI，以及一个生成的 GitHub README。共享事实来自单一中文简介文档（`static/data/intro.json`）；CLI 打印已发布的 README，而不是读取该文件。

## Audience

打开 heyq02.com、运行 `heyq02` 命令，或阅读 GitHub 主页 README 的人。

## Capabilities

- **站点。** heyq02.com 是一个纯中文的 Rspress 站点，没有 `/zh/` 前缀，也没有语言切换器。文章用中文撰写，直接提交在 `apps/site/blogs`。首页包含个人简介、工作经历、技能与开源项目，由主题组件布局。联系方式放在导航栏。侧边栏、友链、LLM 索引等界面文案全部为中文。
- **CLI。** 已发布的 `heyq02` 包拉取 GitHub README 并在终端渲染输出。忽略参数，没有 help 或 version 命令。
- **README。** 生成器从中文字段简介文档写出 GitHub 主页 README（问候、工作经历、技能图标）。

## Non-goals

- 不做 CMS。博客是仓库里的 Markdown，不是在线编辑器。
- 不做多语言站点。英文版已下线，不再维护，也不保留 `/zh/` 路由或翻译流水线。

除此之外本仓库暂未实现的部分属于待办，而非禁止。

## Principles

- 一份中文简介文档是站点与 README 共享事实的唯一来源。CLI 展示的就是那份 README。
- 各展示层保持轻薄。共享事实放在简介文档里，见 `architecture`。
