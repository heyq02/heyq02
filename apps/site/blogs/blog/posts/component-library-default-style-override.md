---
title: 实习笔记：修改组件库的默认样式
description: 组件库默认的内边距影响外部布局时，用外层类名包裹并覆盖内部组件样式。
date: 2023-06-09
---

# 实习笔记：修改组件库的默认样式

## 一、问题背景

![](https://i-blog.csdnimg.cn/blog_migrate/6d10e2cc5976f146cedf8528243d7f6e.png)

这是目前的网页，使用了 semi-ui 的组件库。

![](https://i-blog.csdnimg.cn/blog_migrate/c022defeb06e4e7cd2d5530ecce96afa.png)

可以看到，semi-ui 给内部组件包裹了一个 16px 的右侧内边距。

![](https://i-blog.csdnimg.cn/blog_migrate/7ee9ae866f3954cbbf852e1fbe9d94b6.png)

临时添加一个边框，能更明显地看出默认样式影响了外部两个表单元素的间距。我想消除这个影响，就需要把组件库的默认样式覆盖掉。

## 二、解决方法

给外部的 div 增加一个类名，然后通过该类名包裹内部组件类进行样式覆盖。

![](https://i-blog.csdnimg.cn/blog_migrate/1171c1564907d12efd1032c2d373d782.png)

![](https://i-blog.csdnimg.cn/blog_migrate/340f5e812b096d965d97bf168b95da30.png)

这样子就实现了对组件库样式的覆盖。

![](https://i-blog.csdnimg.cn/blog_migrate/f863d37ef56962a6abb1cbcf010845d2.png)
