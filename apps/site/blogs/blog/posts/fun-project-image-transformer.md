---
title: 趣味项目：命令行图片格式转换器
date: 2024-03-18
---

# 趣味项目：命令行图片格式转换器

::: tip {title="项目链接"}
仓库：[xxhls/image-transformer](https://github.com/xxhls/image-transformer)
:::

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/76c6e152500e035994999b4b31667de5.png)

## 项目介绍

一款命令行内可以批量修改图片格式的工具

## 使用方式

```shell
npm install @xxhls/image-transformer -g

img-t --name='.*.tiff' --target='png' --path='./images' --recursion='true'
```

## 技术选型

- typeScript: 支持类型体操
- chalk: 命令行输出色彩
- commander: 解析命令行参数
- fs-extra: 拓展原生 fs 的功能
- jimp: 修改图片格式的工具包
- parcel: 零配置打包工具

## 代码分析

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/152c49f876d38839b25f7990bb93b1a9.png)

- core: 转换器 Map
- log: 日志工具
- utils: 文件名过滤器、文件递归搜索器、文件拓展名获取、文件夹过滤器
- index.ts 主函数

## 执行流程

1. 获取命令行参数：文件名 | 目标格式 | 文件路径 | 是否递归
2. 文件路径的默认值是当前路径，默认不递归
3. 根据文件路径和递归标志搜索全部文件和文件夹
4. 将文件夹进行过滤
5. 通过文件名对文件进行二次过滤
6. 遍历文件名，获取拓展名，根据 map 获取拓展名对应的转换器
7. 转化器传入目标格式和源文件地址，将转换后的文件保存在源文件同一文件夹下

## 更新计划

将格式转换器从 JIMP 转成 SHARP，从而支持更多格式的图片类型
