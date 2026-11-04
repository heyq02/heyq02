---
title: 软件安装教程：Anaconda
date: 2024-03-06
---

# 软件安装教程：Anaconda

> [!TIP] 环境信息
> - 系统：Windows 11 64 位
> - 版本：Anaconda3-2024.02-1
> - 官网：[Anaconda](https://www.anaconda.com/)
> - 网盘：[百度网盘](https://pan.baidu.com/s/1wBsYno8MQuuRz6DAyu0tbg?pwd=zkgl)（提取码 `zkgl`）

## 下载

- 打开 [Anaconda 下载页](https://www.anaconda.com/download/) 获取最新版

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/5b5cb917cbb8146769d54917ecf73eb1.png)

- 或从 [百度网盘](https://pan.baidu.com/s/1wBsYno8MQuuRz6DAyu0tbg?pwd=zkgl) 下载 Anaconda3-2024.02-1

## 安装

- 双击下载好的文件
  ![效果截图](https://i-blog.csdnimg.cn/blog_migrate/36bd2aafbf022bfc5ed247f9ead173bf.png)
- 点击 Next
  ![效果截图](https://i-blog.csdnimg.cn/blog_migrate/54ffbddd340201c6cab0f4ed925342d5.png)

- 点击 I Agree
  ![效果截图](https://i-blog.csdnimg.cn/blog_migrate/f88d5fe05da0eb5ca77df1bc35ce667f.png)

- 选择 Just Me 后点击 Next
  ![效果截图](https://i-blog.csdnimg.cn/blog_migrate/798d4f41c0aba381efd905afdf19f4f7.png)

- 自定义安装路径，推荐全英文
  ![效果截图](https://i-blog.csdnimg.cn/blog_migrate/72a3ecbddeb1d41c6aea00af1d84baba.png)

- 勾选 1 3，点击 Install
  ![效果截图](https://i-blog.csdnimg.cn/blog_migrate/bd84a7f1543c5a1c9836773366daeec9.png)
- 安装完毕后点击 Next -> Next -> Finish
- 静静等待他第一次启动完关闭就行

## 配置

- 点击页面开始按钮

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/cf383e93c8791ad1252c53bd4335a4e1.png)

- 搜索栏输入查看高级系统设置并回车

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/a126bb3904be75e8b3399fb3e811dace.png)

- 点击环境变量
- 双击系统环境变量中的 Path 项

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/cb27b4871c37aff85df71a3f2634d700.png)

- 点击新建 -> 浏览，选择 Anaconda 安装目录 -> 确定
- 点击新建 -> 浏览，选择 Anaconda 安装目录下的 Scripts 目录 -> 确定
- 点击新建 -> 浏览，选择 Anaconda 安装目录下的 Library\bin 目录 -> 确定
- 点击新建 -> 浏览，选择 Anaconda 安装目录下的 Library\usr\bin 目录 -> 确定
- 点击新建 -> 浏览，选择 Anaconda 安装目录下的 Library\mingw-w64\bin 目录 -> 确定

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/6de071293d78986ece7163ab75b90c24.png)

- 依次点击确定关闭页面
- 打开 cmd ，输入 conda --version 测试是否配置成功
- 对于 powershell，输入 conda init powershell 进行初始化
