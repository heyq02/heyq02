---
title: 趣味项目：VitePress 搭建个人博客
date: 2024-03-22
---

# 趣味项目：VitePress 搭建个人博客

::: tip {title="项目链接"}
- 仓库：[xxhls/blog](https://github.com/xxhls/blog)
- 站点：[xxhls.tech](http://xxhls.tech)
:::

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/6fa05c181964670534dcf146dbd48e43.png)

## 项目介绍

前段时间买了服务器和域名，一直闲置着；这两天打算搭个个人网站。当时流行的有 Hexo、WordPress，但我更喜欢 VitePress 的样式，就改装成博客框架。

## 使用方式

1. git 克隆项目
2. 设置scp免密码传输，可以参考这个教程 [linux无需输入密码完成scp复制](https://zhuanlan.zhihu.com/p/94615240)
3. 服务器安装nginx
4. 将nginx资源目录和服务器ip替换掉脚本里面的
5. 运行pnpm make

## 可修改项

- 首页内容可以修改index.md
- 添加博客需要同时修改blogs/index.md
- 添加项目只需要修改projects/index.md

## 更新计划

- 根据博客内容动态生成blogs/index.md
