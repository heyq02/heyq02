---
title: 用 Rspress 构建个人网站
date: 2026-06-22
---

# 用 Rspress 构建个人网站

欢迎来到我的个人网站！

这是 [avotokyo.me](https://avotokyo.me/) 改造后的第一篇文章。旧站功能分散、维护成本偏高；这次重做的目标很明确：**把内容、数据与展示层拆开，让后续加页面、改文案、发博客都尽量简单**。

## 站点里有什么

首页是入口，顶部导航可以直达各栏目：

| 栏目                                      | 内容                         |
| ----------------------------------------- | ---------------------------- |
| [Projects](https://avotokyo.me/projects/) | 我创建或维护的开源项目       |
| [Blog](/blog/)                            | 技术文章与开发笔记           |
| [Uses](https://avotokyo.me/uses/)         | 日常使用的编辑器、硬件与工具 |
| [Photos](https://avotokyo.me/photos/)     | 旅行与摄影记录               |
| [About](https://avotokyo.me/about/)       | 更多关于我的介绍             |

项目列表、Uses 清单、照片墙等结构化内容放在 `src/data/*.json`，MDX 页面只负责引入数据并传给展示组件。改 JSON 就能更新页面，不必动布局代码。

## 技术选型

| 层       | 技术                                                                                       |
| -------- | ------------------------------------------------------------------------------------------ |
| 静态站点 | [Rspress](https://rspress.rs/) 2                                                           |
| UI       | React 19、[Tailwind CSS](https://tailwindcss.com/) v4、[shadcn/ui](https://ui.shadcn.com/) |
| 构建     | Rsbuild、vite-plus                                                                         |
| 插件     | RSS、Sitemap、Vercel Analytics                                                             |
| 部署     | GitHub Actions → GitHub Pages                                                              |

选 Rspress 主要是因为它原生支持 MDX 与主题定制，和文档工程的工作流契合。Tailwind v4 负责样式，shadcn/ui 提供 Button、Card、Badge 等可复用原语——组件源码在仓库里，改起来比黑盒 UI 库顺手。

## 仓库结构

站点是一个 pnpm monorepo，核心分层如下：

```
docs/          # MDX 页面与博客正文
src/
├── config/    # 站点元数据（URL、标题、描述）
└── data/      # JSON 静态数据（导航、项目、照片等）
packages/
├── rspress-components/   # UI 原语 + 站点展示组件
├── rspress-data/         # Zod schema 与 TypeScript 类型
├── rspress-plugin-site-page-defaults/
└── rspress-plugin-vercel-analytics/
```

几个设计上的取舍：

- **`src/config/site.ts` 作为元数据单一来源** — `description`、`identity` 等全局文案只写一处，首页与 About 页通过 MDX 引用，避免多处同步。
- **JSON + Zod 校验** — 构建时调用 `validateSiteData`，数据格式不对会直接中断构建，比运行时才发现 typo 省心。
- **博客自动索引** — 文章放在 `docs/blog/` 并写好 frontmatter，`BlogList` 通过 `usePages()` 自动汇总，无需手动维护列表。
- **布局 frontmatter 统一注入** — 栏目页的 `pageType`、`sidebar` 等由 `@avotokyo/rspress-plugin-site-page-defaults` 处理，MDX 文件更干净。

完整说明见仓库 [README](https://github.com/avotokyo/avotokyo.me)。

## 后续写什么

博客会陆续记录开发过程中的实际问题与解法，大致方向包括：

- 前端工具链与工程实践（Vite、Rspress、TypeScript）
- 开源项目维护与 CI/CD
- 文档站点与开发者体验

如果你也对静态站点、文档工程或 monorepo 组织方式感兴趣，欢迎通过 [GitHub](https://github.com/avotokyo) 或 X 交流。

---

感谢来访，Enjoy reading!
