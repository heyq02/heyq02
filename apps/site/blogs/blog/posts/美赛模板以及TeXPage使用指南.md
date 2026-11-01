---
title: "美赛模板以及TeXPage使用指南"
author: "Ari He"
date: "于 2023-02-25 14:40:04 发布"
source: "https://blog.csdn.net/m0_66681776/article/details/122752970?spm=1011.2415.3001.5331"
---

提示：.zip下载地址：://pan.baidu.com/s/1xCTFZUfqTaM9Eldx8qf2JA
 提取码：0130
 
 
 

#### 文章目录
 
 

- [前言](#_10)
- [一、打开TeXPage](#pandas_19)
- [二、模板使用步骤](#_26)
  - [1.创建空项目](#1_27)
  - [2.写入源码](#2_45)
  - 3.上传附件
  - 4.开始编译
- [总结](#_63)

 


---



## 前言
 


新发现的宝藏网站-TeXPage，可以在线编写TeX文件，较之、TeXlive等更加灵活自由。附有博主参考GitHub上发布的代码编写的ICM模板，具体使用步骤也会有说明。
 


---



提示：以下是本篇文章正文内容，下面使用步骤可供参考
 


## 一、打开TeXPage
 


可以之间在百度搜索TeXPage官网并注册账号，对于咱们这种平民使用者，免费版的功能就已经很完善了。网址附下：[TeXPage - LaTeX 在线编辑器 | LaTeX 在线编译https://www.texpage.com/](https://www.texpage.com/)
 


## 二、模板使用步骤
 


### 1.点击，创建空项目，名称随意
 


![](https://i-blog.csdnimg.cn/blog_migrate/3fd5e0d5d489e047153ee2858bcb9d84.png)
 


 ![](https://i-blog.csdnimg.cn/blog_migrate/f114633d92ae329ac7ea0f1ebcf5dae1.png)
 


### 2.写入
 


只需要将压缩包内的ICM-demo代码.打开，然后将代码粘贴即可，部分代码示例：
 


```
\documentclass{mcmthesis}
\mcmsetup{CTeX=false,
    tcn=0000,problem=E,
    sheet=true,titleinsheet=true,keywordsinsheet=true,
    titlepage=true,abstract=true} %抬头区域
\usepackage{newtxtext}
\usepackage{lipsum}
```
 


……
 


### 3.上传附件
 


点击页面左上方云朵图标
 


![](https://i-blog.csdnimg.cn/blog_migrate/ef41b33c4beca737284a0a5d8940029d.png)
 



 


选择图片以及代码上传（只需要上传example--a.pdf、mcmthesis-logo.pdf、mcmthesis-matlab1.m、mcmthesis-sudoku.cpp）
 


![](https://i-blog.csdnimg.cn/blog_migrate/aaa6a42d9fa3c7ff8de0bc38923cecf4.png)
 



 


###  4.开始编译
 


点击编译，下方为例图
 


![](https://i-blog.csdnimg.cn/blog_migrate/a7362a0be646f57030320fc6ef51590c.png)
 


---



## 总结
 


TeXPage真的一个宝藏网站，博主自己电脑下载LaTeX总是失败，气。ICM模板代码是博主根据GitHub整理的，并不是博主本人原创。若有疑问，欢迎留言。（确定不点个关注嘛，QAQ）

---
> 原文链接: [美赛模板以及TeXPage使用指南](https://blog.csdn.net/m0_66681776/article/details/122752970?spm=1011.2415.3001.5331)
> 作者: Ari He
