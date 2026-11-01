---
title: 美赛 LaTeX 关键操作：表格、图片、公式与代码块
description: 美赛写作最常用的 LaTeX 操作：表格、插图、公式和代码块的完整代码与逐行解释。
date: 2023-02-26
---

# 美赛 LaTeX 关键操作：表格、图片、公式与代码块

2022 年美赛开赛前整理的一份 LaTeX 速查：绘制表格、插入图片、插入公式的具体写法和注释要求。下面的代码可以直接复制使用，编号格式已经设置好。

## 1. 绘制表格

### 1.1 代码如下

```latex
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

### 1.2 例图

![](https://i-blog.csdnimg.cn/blog_migrate/8792b0b724a58c03238a8c2fb870be14.png)

### 1.3 详解

表格的插入不需要额外的宏包。

`\caption{}` 大括号内可以设置表格标题。

边框的设置很有意思：纵向线条由 `{c|c}` 这样的格式预设，横向线条用 `\hline` 语句绘制。`c|c` 表示两列，`|c|c|` 也是两列，只是后者多了外边框。在第一行 `Symbols & Definition` 之后写 `\hline`，就会在这一行下方画一条横线。横线可以在任意一行上下添加，宽度会自动匹配内容的多少。

## 2. 插入图片

### 2.1 代码如下

```latex
\begin{figure}[htbp]
  \centering
  \includegraphics{Model 1.png}
  \caption{Model 1}
  \label{fig:my_label}
\end{figure}
```

### 2.2 例图

![](https://i-blog.csdnimg.cn/blog_migrate/613ac0847326ad7c148b37a68cd7b38f.png)

### 2.3 详解

首先需要添加宏包 `\usepackage{graphicx}`。

`\caption{}` 大括号内可以设置标题。

`\includegraphics{}` 大括号内放置图片文件名。博主用的是网页版 TeX 编辑器，文件名很好查。

![](https://i-blog.csdnimg.cn/blog_migrate/0bb996c088e0b2259ff1f0cb25a89aed.png)

## 3. 插入公式

### 3.1 代码如下

```latex
\begin{equation}
    AP=\sum_{n}{\gamma_n\omega_mEM}
\end{equation}
```

### 3.2 例图

![](https://i-blog.csdnimg.cn/blog_migrate/440ea58b6514d83353b61b2337d200c5.png)

### 3.3 详解

首先也是添加宏包 `\usepackage{amsmath, amsfonts}`。

公式环境 `equation` 已经处理好了格式，关键是大括号里的公式怎么写。这里推荐一篇写得很详细的博文：[LaTeX数学公式-详细教程_NSJim的博客-CSDN博客_latex数学公式](https://blog.csdn.net/NSJim/article/details/109045914)

> 原文：[美赛 LaTeX 关键操作讲解](https://blog.csdn.net/m0_66681776/article/details/122970975?spm=1011.2415.3001.5331) · 作者 m0_66681776
