---
title: 开发技巧指北：IDEA 修改默认绑定的 Maven 仓库地址
description: 改 IDEA 内置 Maven 的 settings.xml 并勾选重写，把默认仓库换成自定义地址。
date: 2025-05-29
---

# 开发技巧指北：IDEA 修改默认绑定的 Maven 仓库地址

> Microsoft Windows 11 家庭中文版
> IntelliJ IDEA 2025.1.1.1

## 默认的 IDEA 是有自己捆绑的 Maven 的（这是修改完毕的截图）

![](https://i-blog.csdnimg.cn/direct/8bf4450a71fe414fb0e305a5e68e0af7.png)

## 修改默认的，路径是 IDEA 安装路径下的 plugins

`D:\Softwares\IntelliJ IDEA 2025.1.1.1\plugins\maven\lib\maven3\conf`

![](https://i-blog.csdnimg.cn/direct/c4f6f67699944cf186a4b916328d9359.png)

## 修改 .xml 的 localStorage

![](https://i-blog.csdnimg.cn/direct/ad2a77c73ee34bc08499ec957234d236.png)

## 重启 IDEA，在 Maven 配置里面勾选重写

## 再次重启 IDEA，创建一个测试

![](https://i-blog.csdnimg.cn/direct/5c050f7e1ee24aa5ae01a85f2b924c40.png)

> 原文：[【开发技巧指北】IDEA修改默认绑定Maven的仓库地址](https://blog.csdn.net/m0_66681776/article/details/148294789?spm=1011.2415.3001.5331) · 作者 m0_66681776
