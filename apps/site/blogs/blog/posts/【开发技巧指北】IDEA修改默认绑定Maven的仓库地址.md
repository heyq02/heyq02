---
title: "【开发技巧指北】IDEA修改默认绑定Maven的仓库地址"
author: "Ari He"
date: "于 2025-05-29 03:32:50 发布"
source: "https://blog.csdn.net/m0_66681776/article/details/148294789?spm=1011.2415.3001.5331"
---

## 【开发技巧指北】IDEA修改默认绑定的仓库地址



> 
> Microsoft Windows 11 家庭中文版
> IIntelliJ IDEA 2025.1.1.1
> 



### 默认的IDEA是有自己捆绑的Maven的（这是修改完毕的截图）



![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/8bf4450a71fe414fb0e305a5e68e0af7.png)



### 修改默认的，路径是IDEA安装路径下的plugins



D:\Softwares\ 2025.1.1.1\\maven\lib\maven3\conf

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/c4f6f67699944cf186a4b916328d9359.png)



### 修改.xml的localStorage



![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/ad2a77c73ee34bc08499ec957234d236.png)



### 重启IDEA，在Maven配置里面勾选重写



### 再次重启IDEA，创建一个测试



![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/5c050f7e1ee24aa5ae01a85f2b924c40.png)

---
> 原文链接: [【开发技巧指北】IDEA修改默认绑定Maven的仓库地址](https://blog.csdn.net/m0_66681776/article/details/148294789?spm=1011.2415.3001.5331)
> 作者: Ari He
