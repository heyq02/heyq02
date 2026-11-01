---
title: "React中使用路径别名引用资源设置背景图"
author: "Ari He"
date: "已于 2023-11-12 17:09:51 修改"
source: "https://blog.csdn.net/m0_66681776/article/details/134362826?spm=1011.2415.3001.5331"
---

> 
> 为了解决url()路径引入问题，将其转化成base64编码进而拼接字符串
> 




## 1. 问题背景




在中使用css-in-js为元素添加背景图会产生奇怪的bug




![](https://i-blog.csdnimg.cn/blog_migrate/3dd365d746f3c4b2c21be912d2fdf59d.png)




![](https://i-blog.csdnimg.cn/blog_migrate/2675570d2494ea77c9188c9f8036dbb7.png)




可以看到在路径前后产生了一个"e;




## 2. 




![](https://i-blog.csdnimg.cn/blog_migrate/65061af79111cd9f02091bb33e4af081.png)




先路径别名引入资源，再拼接字符串。但是这样是使用了编码的方式




![](https://i-blog.csdnimg.cn/blog_migrate/2ef175e5106224b9e1bf70304efd4448.png)




一种取巧的方式

---
> 原文链接: [React中使用路径别名引用资源设置背景图](https://blog.csdn.net/m0_66681776/article/details/134362826?spm=1011.2415.3001.5331)
> 作者: Ari He
