---
id: site
type: module-design
status: draft
title: 个人主页站点
parent: architecture
depends-on:
  [
    shared,
    rspress-theme-heyq02,
    rspress-plugin-site-assets,
    rspress-plugin-blog-meta,
    rspress-plugin-profile
  ]
---

## Responsibility

heyq02.com 的 Rspress 站点，纯中文、单语言：`lang: 'zh'`，没有 `locales`，因此所有页面都在无前缀路由下，也没有语言切换器。站点是轻薄的组合根：内容在 `blogs/`，`rspress.config.ts` 负责接线，外加部署脚本。行为都在 `rspress-theme-heyq02` 与 `rspress-plugin-*` 包里；导航栏社交链接来自 `shared.socialLinksFrom`。Tailwind CSS v4 在此接线（`tailwind.css` + `@rsbuild/plugin-tailwindcss`）；主题/插件源码通过 `@source` 被扫描。

导航栏 `activeMatch` 规则互斥（`首页` 只匹配 `/` 或 `/index.html`；`博客` / `友链` 只匹配各自前缀）。`Travellings` 是外链（`https://www.travellings.cn/go.html`），没有 `activeMatch`。导航与友链标签为中文，见 `blogs/_nav.json`。导航栏外观切换默认跟随系统主题。

`llms.txt`、RSS、侧边栏标签、友链交互文案与代码块「复制 Markdown」等界面字符串全部为中文；只有 Rspress 内置概览筛选的两条文案需要 `i18nSource` 覆盖。外壳标题与描述来自中文简介。

## Boundary

- 可依赖 `shared`、rspress 主题/插件包与 `@rspress/core`，可为配置 meta 读取 `static/data/intro.json`。不得读取 `readme` 或 `cli`，不得渲染 `sponsorkit/` 产物。
- `rspress.config.ts` 可导入无 scope 的 `rspress-plugin-*`、`@heyq02/shared`（`socialLinksFrom`），并把 `themeDir` 解析到主题包路径（`architecture`：app 的 **Vite** 配置不得导入 `@heyq02/*`）。
- 主题 UI 与友链数据在 `rspress-theme-heyq02`。首页 MDX、博客 meta、置顶项目（经 profile → github-pins）与公共资源在路由扫描前由插件重新生成；`blogs/index.mdx`、`blogs/public` 与博客 `_meta.json` 被 gitignore。
- `@rspress/plugin-rss` 用 `/blog/posts/` 构建 `/rss/blog.xml`。生成只在 `rspress build` 时运行，`dev` 不生成。
- Agent 友好构建：`llms` 自定义 `llmsTxt`；`webMcp: true`；`themeConfig.llmsUI`（`injectLlmsHint`、`viewOptions: false`）；主题 `chrome.css` 隐藏 `.rp-llms-container`；`fallbackHeadingTitle: false`；Open Graph/`head` meta；`editLink` + `lastUpdated`；内置 `sitemap: true` 输出 `/sitemap.xml`。
- GitHub Pages 不支持 `Accept: text/markdown` 协商；agent 使用显式 `.md` / `llms.txt` 地址。`scripts/build.ts` 在 `rspress build` 后用 `absolutize-md-links.ts` 处理 SSG-MD 链接并拷贝 `CNAME`（e2e 使用同一路径）。
- Favicon 与导航栏签名通过 `rspress-plugin-site-assets` 使用 `static/signature/full-nobg`。`outDir` 保持为 `dist`。

## Limitations

内容只有中文：`apps/site/blogs` 下是 `blog/`（`posts/`、`interview/` 与概览页）、`friends.mdx` 和 `_nav.json`，全部提交在仓库里，不在构建期生成或翻译。`<lang>/blog/posts` 与 `blog/interview` 下的 Markdown 变成文档页。`/blog/` 是一个 Rspress Overview，侧边栏依次为概览、文章、面经（组内按 frontmatter/`YYYY-MM-DD` 倒序）。首页**不**列文章；文章在 `/blog/` 下。每次 `rspress dev` / `build` 都会在路由扫描前由插件重新生成首页 MDX、置顶卡片、博客 meta 与公共资源。没有 GitHub token 时置顶/简介步骤会失败。`lastUpdated` 需要完整 git 历史（Release Site 中 `fetch-depth: 0`）。

不存在英文产物：没有 `blogs/en` 树、没有 `i18n/en` 模板、没有 DeepSeek 翻译插件或 `DEEPSEEK_*` 密钥，`/zh/` 路径也不再存在。

## Testing

- 单测覆盖率至少 95%（语句、分支、函数、行）。
- 必须有独立的 `e2e/` 套件；通过根目录 `pnpm test:e2e` 运行（服务 `cbuild` 产物）。卡片外观断言计算样式；开源/友链卡片锁定 Playwright **DOM** 快照（规范化后的 `outerHTML`），不是像素截图。
- 单测还快照友链卡片/网格 HTML 与生成的开源 MDX 卡片标记。
- Tailwind `@source` 必须包含 `packages/shared/src`，否则 `site-ui` 的 class token 会被 purge。
- 主题包的 e2e harness 加载站点 Tailwind 与 `harness.css` 的 Rspress token，并断言友链卡片 DOM。
