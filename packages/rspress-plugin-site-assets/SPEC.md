---
id: rspress-plugin-site-assets
type: module-design
status: draft
title: 站点公共资源插件
parent: architecture
---

## Responsibility

在 Rspress 提供服务/构建前，把签名 favicon、微信二维码与页面水印拷贝到 `blogs/public`。

## Boundary

- 读取 `static/signature/`（经 `siteRoot` 相对 monorepo 定位）以及 `apps/site/public/wechat.jpg`、`apps/site/public/wuxian-jinbu.png`。不生成 MDX 或 meta JSON。

## Testing

- 单测覆盖率至少 95%（语句、分支、函数、行）。
- 必须有独立的 `e2e/` 套件；通过根目录 `pnpm test:e2e` 运行。
