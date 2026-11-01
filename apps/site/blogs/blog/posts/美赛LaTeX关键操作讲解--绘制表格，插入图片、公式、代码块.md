---
title: 美赛 LaTeX 关键操作：表格、图片、公式与代码块
description: 美赛写作最常用的 LaTeX 操作：表格、插图、公式和代码块的完整代码与逐行解释。
date: 2023-02-26
---

# 美赛 LaTeX 关键操作：表格、图片、公式与代码块

> 后天2022年美赛就开始了，针对写作要求，博主着重整理了一下运用LaTeX绘制表格，插入图片、公式的详细操作以及相应的注释要求。（以下代码直接复制便可以使用，编号格式方面以及设置好了）
> 希望大家都能在2022的美赛取得个好成绩哦！

### 1.绘制表格

#### 1.1如下：

```js
\begin{table}[htbp]
    \centering
    \caption{Symbols and Definition}
    \label{tab:my_label}
    \begin{tabular}{c|c}
        Symbols&Definition\\
        \hline
        PEI&The extent to which plastic processing affects the environment\\
        PODI&The degree to which plastic processing breaks the environment\\
        POEI&How much plastic handling optimises the environment\\
        PPRO&Plastic production\\
        PP&Plastic pollution levels
    \end{tabular}
\end{table}
```

#### 1.2例图：

![](https://i-blog.csdnimg.cn/blog_migrate/8792b0b724a58c03238a8c2fb870be14.png)

#### 1.3详解：

表格的插入不需要额外的包

\caption{ and Definition}大括号内可以设置表格标题

边框的设置在中很有趣，他的纵向线条是运用格式预设的，而横向线条是运用语句\hline绘制的。c|c指的便是两列，而|c|c|指的也是两列，不过后者有外边框，这一点应该很容易理解。而我在输入第一行Symbols……后输入了语句\hline，则在Symbols……下方绘制了一条纵向。纵线的绘制是任意的，在任何一条语句（包括Symbols……）的上下方都可以绘制横线，并且会自动与内容的多少匹配。

### 2.插入图片

#### 2.1代码如下：

```js
\begin{figure}[htbp]
  \centering
  \includegraphics{Model 1.png}
  \caption{Model 1}
  \label{fig:my_label}
\end{figure}
```

#### 2.2例图：

![](https://i-blog.csdnimg.cn/blog_migrate/613ac0847326ad7c148b37a68cd7b38f.png)

#### 2.3详解：

首先需要添加宏包\usepackage{graphicx}

\caption{ 1}大括号内可以设置标题

\includegraphics{Model 1.png}大括号内放置图片的名称。博主用的是网页版的TeX编辑器，称很好查。

![](https://i-blog.csdnimg.cn/blog_migrate/0bb996c088e0b2259ff1f0cb25a89aed.png)

### 3.插入公式

#### 3.1代码如下：

```js
\begin{equation}
    AP=\sum_{n}{\gamma_n\omega_mEM}
\end{equation}
```

#### 3.2例图：

![](https://i-blog.csdnimg.cn/blog_migrate/440ea58b6514d83353b61b2337d200c5.png)

#### 3.3详解：

首先也是添加宏包\usepackage{amsmath, amsfonts}

格式问题equation以及解决好了，关键便是的书写，这里推荐一位博主的博文，写的非常详细：[LaTeX数学公式-详细教程_NSJim的博客-CSDN博客_latex数学公式](https://blog.csdn.net/NSJim/article/details/109045914)

---
> 原文链接: [美赛LaTeX关键操作讲解--绘制表格，插入图片、公式、代码块](https://blog.csdn.net/m0_66681776/article/details/122970975?spm=1011.2415.3001.5331)
> 作者: m0_66681776
