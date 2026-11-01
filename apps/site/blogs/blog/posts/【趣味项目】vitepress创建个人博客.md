---
date: 2024-03-22
---

# 【趣味项目】vitepress创建个人博客

项目地址：[GitHub](https://github.com/xxhls/blog)
博客地址：[xxhls.tech](http://xxhls.tech)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/6fa05c181964670534dcf146dbd48e43.png)

## 项目介绍

前段时间买了个服务器和域名，但是一直闲置者，这两天闲下来打算搞个个人网站。目前流向的有hexo、wordpress，但是我对vitepress的样式很是喜欢，就将其改装一下作为博客框架

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
