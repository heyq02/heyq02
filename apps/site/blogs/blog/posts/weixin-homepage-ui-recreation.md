---
title: 趣味项目：UI 复现微信官网首页
description: 用 Vite + React + Tailwind / SCSS 复刻 weixin.qq.com 首页布局，并部署到 GitHub Pages。
date: 2026-11-01
---

# 趣味项目：UI 复现微信官网首页

::: tip {title="项目链接"}
- 仓库：[xxhls/weixin.qq.com](https://github.com/xxhls/weixin.qq.com)
- 在线：[xxhls.github.io/weixin.qq.com](https://xxhls.github.io/weixin.qq.com/)
- 视频：[Bilibili BV1batYeMEjY](https://www.bilibili.com/video/BV1batYeMEjY)
:::

::: info {title="你会得到什么"}
一份业余练手的微信官网首页 UI 复现：技术选型、目录与组件结构、数据与样式约定，以及 GitHub Pages 部署方式。
:::

![微信官网首页 UI 复现效果](https://img-blog.csdnimg.cn/img_convert/9dfc4f3a0402345338b1cd7e79809a19.png)

## 1. 项目概述

工作之余练一下 UI 绘制与布局，目标是复现微信官网首页的主要视觉与交互区块。

源码资源也可在 [CSDN 下载页](https://download.csdn.net/download/m0_66681776/89763505) 获取。

## 2. 技术选型

| 用途         | 选型                                                                         |
| ------------ | ---------------------------------------------------------------------------- |
| 构建工具     | [Vite](https://cn.vitejs.dev/)                                               |
| UI 框架      | [React](https://zh-hans.react.dev/learn)                                     |
| CSS 预处理器 | [SCSS](https://sass-lang.com/documentation/syntax/)                          |
| CSS 原子框架 | [Tailwind CSS](https://www.tailwindcss.cn/)                                  |
| 路由         | [React Router](https://reactrouter.com/en/main)                              |
| 代码格式化   | [Biome](https://biomejs.dev/zh-cn/) & [Stylelint](https://www.stylelint.cn/) |
| CI/CD        | [GitHub Actions](https://docs.github.com/zh/actions)                         |
| 在线部署     | [GitHub Pages](https://pages.github.com/)                                    |
| 图床         | [聚合图床](https://www.superbed.cn/)                                         |

## 3. 目录结构

```text
.github/workflows/github-pages.yml   # GitHub Pages 部署工作流
public/
src/
  assets/
  components/                        # Banner、ChangeLog、Download、Footer 等
  constants/platformsIcon            # 平台图标表
  layout/index.tsx                   # 布局
  pages/index/index.tsx              # 首页
  router/index.tsx                   # 路由
  styles/
    common.scss                      # 公共混入
    variables.scss                   # 变量
  App.tsx
  main.css
  main.tsx
biome.json
stylelintrc.json
tailwind.config.js
vite.config.ts
```

## 4. 页面结构

```text
App
└─ Layout
   └─ RouterProvider
      └─ IndexPage
         ├─ Banner
         │  ├─ Changelog → LogItem
         │  ├─ Download → LoadItem
         │  └─ Others → OtherItem
         ├─ Links → Link
         └─ Footer
```

## 5. 数据流转

1. 全部数据放在首页目录下的 `mockData.json`
2. 不在父组件层层下发，业务组件内部自行引入 JSON

## 6. 样式说明

- 数值类样式统一收进 SCSS 变量
- 单层、零散复用优先 Tailwind CSS
- 多重组合复用走 SCSS mixin（带形参）

## 7. 常量说明

`platformIcons` 维护平台与图标的对应关系；值为聚合图床链接，本地静态资源里也有备份。

## 8. 部署说明

通过 GitHub Actions 工作流直接部署到 GitHub Pages。

## 9. 其他

后续还会继续完善，欢迎交流。
