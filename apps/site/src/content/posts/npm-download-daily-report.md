---
title: 趣味项目：NPM 下载量日报
description: 定时拉取监视中的 npm 包下载量，再通过邮件发到自己的邮箱，省去每天打开官网查询。
date: 2024-03-19
---

# 趣味项目：NPM 下载量日报

::: tip {title="项目链接"}
仓库：[xxhls/npm-radio](https://github.com/xxhls/npm-radio)
:::

::: info {title="你会得到什么"}
一套「查下载量 → 组邮件 → 定时发到 QQ 邮箱」的业余小工具：技术选型、执行流程，以及在云服务器上用 crontab 跑起来的大致步骤。
:::

![NPM 下载量日报邮件效果](https://i-blog.csdnimg.cn/blog_migrate/107dfafb435562c62d4b50fb98ada3d8.png)

## 1. 项目介绍

前几天发了几个开源 npm 包，想每天看看下载量。每次打开 npm 官网再搜就很麻烦，于是做了这个项目：用定时任务每天请求包的下载量，再发到自己的 QQ 邮箱。

## 2. 使用方式

部署步骤偏多，这里只列主干；更细的指引可私信或看仓库注释。

1. `git clone` 源码仓库
2. 登录 QQ 邮箱，拿到 SMTP 授权码
3. 在根目录创建 `.env`，设置账号相关变量：

   ![`.env` 环境变量示例](https://i-blog.csdnimg.cn/blog_migrate/dd5200e7e48934a182f0dc157b43c748.png)

4. 配置需要监视的 npm 包：

   ![监视包列表示例](https://i-blog.csdnimg.cn/blog_migrate/3cd9e0d50a44877935697f30966bccdc.png)

5. 运行打包：`pnpm build:parcel`
6. 登录云服务器（阿里云、京东云、腾讯云等）
7. 配置 Linux SSH 认证
8. 把 `pkg` 里用于上传的地址改成自己的 IP 与文件路径
9. 在服务器上配置 crontab，周期执行打包后的 JS 脚本

## 3. 技术选型

| 用途      | 选型       |
| --------- | ---------- |
| 环境变量  | dotenv     |
| HTTP 请求 | axios      |
| 发信      | nodemailer |

## 4. 执行流程

1. 检测 `.env` 是否存在
2. 加载环境变量
3. 确认环境变量里有 `USER` 和 `PWD`
4. 创建 axios 实例（走 npmmirror，直连官网容易超时）
5. 读取待监视包列表，用 `Promise.all` 等全部下载量都拉完
6. 创建邮件发送器
7. 设置发送选项
8. 用包数据生成邮件正文
9. 发送邮件

## 5. 结尾

和前面几个纯前端练手不同，这个项目连编码带部署，步骤更多，文档也不好写细；仓库里的注释相对完整。希望你在理解核心流程后能部署成功——有问题欢迎私信。
