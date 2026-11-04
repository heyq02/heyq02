---
title: 美赛 LaTeX 模板与 TeXPage 使用指南
description: 在 TeXPage 上创建项目、写入源码、上传附件并编译出美赛论文模板。
date: 2023-02-25
---

# 美赛 LaTeX 模板与 TeXPage 使用指南

提示：.zip 下载地址：<https://pan.baidu.com/s/1xCTFZUfqTaM9Eldx8qf2JA> 提取码：0130

## 前言

新发现的宝藏网站 - TeXPage，可以在线编写 TeX 文件，较之本地安装 TeX Live 等方案更加灵活自由。附有博主参考 GitHub 上发布的代码编写的 ICM 模板，具体使用步骤也会有说明。

提示：以下是本篇文章正文内容，下面使用步骤可供参考

## 一、打开 TeXPage

可以之间在百度搜索 TeXPage 官网并注册账号，对于咱们这种平民使用者，免费版的功能就已经很完善了。网址附下：[TeXPage - LaTeX 在线编辑器 | LaTeX 在线编译https://www.texpage.com/](https://www.texpage.com/)

## 二、模板使用步骤

### 1. 创建空项目，名称随意

![](https://i-blog.csdnimg.cn/blog_migrate/3fd5e0d5d489e047153ee2858bcb9d84.png)

![](https://i-blog.csdnimg.cn/blog_migrate/f114633d92ae329ac7ea0f1ebcf5dae1.png)

### 2. 写入源码

只需要将压缩包内的 ICM-demo 代码打开，然后将代码粘贴即可，部分代码示例：

```latex
\documentclass{mcmthesis}
\mcmsetup{CTeX=false,
    tcn=0000,problem=E,
    sheet=true,titleinsheet=true,keywordsinsheet=true,
    titlepage=true,abstract=true} %抬头区域
\usepackage{newtxtext}
\usepackage{lipsum}
```

……

### 3. 上传附件

点击页面左上方云朵图标

![](https://i-blog.csdnimg.cn/blog_migrate/ef41b33c4beca737284a0a5d8940029d.png)

选择图片以及代码上传（只需要上传 example--a.pdf、mcmthesis-logo.pdf、mcmthesis-matlab1.m、mcmthesis-sudoku.cpp）

![](https://i-blog.csdnimg.cn/blog_migrate/aaa6a42d9fa3c7ff8de0bc38923cecf4.png)

### 4. 开始编译

点击编译，下方为示例图

![](https://i-blog.csdnimg.cn/blog_migrate/a7362a0be646f57030320fc6ef51590c.png)

## 总结

TeXPage 真的一个宝藏网站，博主自己电脑下载 LaTeX 总是失败，气。ICM 模板代码是博主根据 GitHub 整理的，并不是博主本人原创。若有疑问，欢迎留言。（确定不点个关注嘛，QAQ）
