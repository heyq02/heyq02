---
title: React 中使用路径别名引用资源设置背景图
description: 路径别名写进 CSS-in-JS 的 url() 会多出奇怪的引号，改成 base64 内联再拼接字符串解决。
date: 2023-11-12
---

# React 中使用路径别名引用资源设置背景图

> 为了解决 url() 路径引入问题，将其转化成 base64 编码进而拼接字符串。

## 1. 问题背景

使用 css-in-js 为元素添加背景图时，会产生奇怪的 bug。

![](https://i-blog.csdnimg.cn/blog_migrate/3dd365d746f3c4b2c21be912d2fdf59d.png)

![](https://i-blog.csdnimg.cn/blog_migrate/2675570d2494ea77c9188c9f8036dbb7.png)

可以看到，路径前后多出了奇怪的引号。

![](https://i-blog.csdnimg.cn/blog_migrate/65061af79111cd9f02091bb33e4af081.png)

先路径别名引入资源，再拼接字符串。但是这样是使用了编码的方式。

![](https://i-blog.csdnimg.cn/blog_migrate/2ef175e5106224b9e1bf70304efd4448.png)

一种取巧的方式。

> 原文：[React中使用路径别名引用资源设置背景图](https://blog.csdn.net/m0_66681776/article/details/134362826?spm=1011.2415.3001.5331) · 作者 m0_66681776
