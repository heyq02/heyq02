---
title: LaTeX 美赛模板 Demo 2.0 修正版
description: 在 Demo 1.0 基础上给一级标题加引导线、把附录和参考文献纳入目录并给目录加超链接，编译出的论文更整齐。
date: 2023-02-26
---

# LaTeX 美赛模板 Demo 2.0 修正版

本次修正在 Demo 1.0 的基础上新增三项：给一级标题插入引导线、把附录与参考文献置入目录、给目录设置超链接。编译出来的论文更美观，用起来也更方便。

## 一、新增功能

### 1. 一级标题插入引导线

Demo 1.0 里直接用 `\tableofcontents` 生成目录，一级标题没有引导线。这里加上 `titletoc` 宏包，把 section、subsection、subsubsection 三级的引导线都补上：

```latex
\usepackage{titletoc}

\titlecontents{section}[1em]{\bfseries \large}{\contentslabel{4em}}{}{~\titlerule*[0.6pc]{$.$}~\contentspage}
\titlecontents{subsection}[4em]{}{\contentslabel{4em}}{}{~\titlerule*[0.6pc]{$.$}~\contentspage}
\titlecontents{subsubsection}[7em]{}{\contentslabel{4em}}{}{~\titlerule*[0.6pc]{$.$}~\contentspage}
```

![](https://i-blog.csdnimg.cn/blog_migrate/f5d0de478a3040c7cff40ae28cf14b70.png)

### 2. 将附录和参考文献置入目录

最早是通过 `\begin{}` 生成附录和参考资料，目录里的 Appendix 看着很格格不入。这次改成 `\section{}`，直接把 Appendix 与 Reference 当成一级标题插进去；同时为了书写方便，用 `\itemize` 给参考文献加引导。

```latex
\section{Reference}
\begin{itemize}
  \item[[1]] D.~E.KNUTH. The \TeX book. The American Mathematical Society and Addison-Wesley Publishing Company, 1984-1986.
  \item[[2]] Lamport, Leslie. \LaTeX: "A Document Preparation System". Addison-Wesley Publishing Company, 1986.
  \item[[3]] \url{https://www.latexstudio.net/}
\end{itemize}

\section{Appendix}
```

![](https://i-blog.csdnimg.cn/blog_migrate/0233466f5c072d9ea8550a7466b000f6.png)

### 3. 给目录设置超链接

这一项最简单，在原有基础上加上 `\usepackage{hyperref}` 即可。

## 二、模板下载

Demo 1.0 的下载和使用地址可以看我的第一篇博文[美赛模板以及 TeXPage 使用指南](https://blog.csdn.net/m0_66681776/article/details/122752970?spm=1001.2014.3001.5501)。和它相比，Demo 2.0 只优化了代码，对附件的引用没有改动，使用时把下面的代码粘贴到原来 Demo 1.0 的位置即可（不需要保留原有代码）。

```latex
\documentclass{mcmthesis}
\mcmsetup{CTeX=false, tcn=2214237, problem=E,
  sheet=true, titleinsheet=true, keywordsinsheet=true,
  titlepage=false, abstract=true}

% 抬头区域
\usepackage{newtxtext}
\usepackage{lipsum}
\usepackage{hyperref}
\usepackage{titletoc}
\titlecontents{section}[1em]{\bfseries \large}{\contentslabel{4em}}{}{~\titlerule*[0.6pc]{$.$}~\contentspage}
\titlecontents{subsection}[4em]{}{\contentslabel{4em}}{}{~\titlerule*[0.6pc]{$.$}~\contentspage}
\titlecontents{subsubsection}[7em]{}{\contentslabel{4em}}{}{~\titlerule*[0.6pc]{$.$}~\contentspage}

% 标题书写区域
\title{The \LaTeX{} Template for MCM Version \MCMversion}
\author{\small\href{http://www.latexstudio.net/}
  {\includegraphics[width=7cm]{mcmthesis-logo}}}
\date{\today}

\begin{document}

% 摘要书写区域
\begin{abstract}
  Use this template to begin typing the first page (summary page) of your electronic report. This template uses a 12-point Times New Roman font. Submit your paper as an Adobe PDF electronic file (e.g. 111111.pdf), typed in English, with a readable font of at least 12-point type.

  Do not include the name of your school, advisor, or team members on this or any page.

  Papers must be within the 25 page limit.

  Be sure to change the control number and problem choice above.

  You may delete these instructions as you begin to type your report here.

  Follow us @COMAPMath on Twitter or COMAPCHINAOFFICIAL on Weibo for the most up to date contest information.

  \begin{keywords}
    keyword1; keyword2
  \end{keywords}
\end{abstract}

\maketitle
\tableofcontents
\newpage

\section{Introduction}

\subsection{Background}
\LaTeX{} is a document preparation system which uses the \TeX typesetting program. It enables you to produce publication-quality documents with great accuracy and consistency. \LaTeX{} works on any computer and produces industry-standard PDF. It is available both in free (open-source) form and commercially. It is especially suited to those with complex mathematics. Install the software from \url{www.tug.org/texlive}.

\subsection{Previous Research}

\subsection{Our Work}
\lipsum[3] % 生成随机段落

\begin{itemize}
  \item the angular velocity of the bat,
  \item the velocity of the ball, and
  \item the position of impact along the bat.
\end{itemize}

% 小标题标记
\lipsum[4] % 生成随机段落
\emph{center of percussion} [Brody 1986]
\lipsum[5]

\begin{Theorem}
  \label{thm:latex}
  \LaTeX
\end{Theorem}

\begin{Lemma}
  \label{thm:tex}
  \TeX
\end{Lemma}

\begin{proof}
  The proof of theorem.
\end{proof}

\section{General Assumptions}
\lipsum[6]

\begin{itemize}
  \item
  \item
  \item
  \item
\end{itemize}

\lipsum[7]

\section{Analysis of the Problem}

% 插入图片 PDF
\begin{figure}[h]
  \small
  \centering
  \includegraphics[width=8cm]{example-image-a}
  \caption{The name of figure}\label{fig:aa} % 图片标题
\end{figure}

\lipsum[8]

% 插入公式
\begin{equation}
  a^2 \label{aa} % 给公式标记
\end{equation}

\lipsum[9]

\section{Calculating and Simplifying the Model}
\lipsum[11]

\section{The Model Results}
\lipsum[6]

\section{Validating the Model}
\lipsum[9]

\section{A Summary}
\lipsum[6]

\section{Evaluate of the Model}

\section{Strength and Weakness}

\subsection{Strength}

\subsection{Weakness}

\begin{itemize}
  \item \textbf{Applies widely}\\
    This system can be used for many types of airplanes, and it also solves the interference during the procedure of boarding airplane, as described above we can get to the optimization boarding time. We also know that all the service is automated.
  \item \textbf{Improve the quality of the airport service}\\
    Balancing the cost and the benefit, it will bring in more convenience for airport and passengers. It also saves many human resources for the airline.
\end{itemize}

\section{Conclusion}

\section{Reference}
\begin{itemize}
  \item[[1]] D.~E.KNUTH. The \TeX book. The American Mathematical Society and Addison-Wesley Publishing Company, 1984-1986.
  \item[[2]] Lamport, Leslie. \LaTeX: "A Document Preparation System". Addison-Wesley Publishing Company, 1986.
  \item[[3]] \url{https://www.latexstudio.net/}
\end{itemize}

\section{Appendix}

\subsection{First appendix}
In addition, your report must include a letter to the Chief Financial Officer (CFO) of the Goodgrant Foundation, Mr. Alpha Chiang, that describes the optimal investment strategy, your modeling approach and major results, and a brief discussion of your proposed concept of a return-on-investment (ROI). This letter should be no more than two pages in length.

\begin{letter}{Dear, Mr. Alpha Chiang}
\lipsum[1-2]

\vspace{\parskip}

Sincerely yours,

Your friends
\end{letter}

Here are simulation programmes we used in our model as follow:

\textbf{\textcolor[rgb]{0.98,0.00,0.00}{Input matlab source:}}
\lstinputlisting[language=Matlab]{mcmthesis-matlab1.m}

\subsection{Second appendix}
some more text

\textcolor[rgb]{0.98,0.00,0.00}{\textbf{Input C++ source:}}
\lstinputlisting[language=C++]{mcmthesis-sudoku.cpp}

\end{document}
```

## 结语

我会持续优化更新美赛 Demo，想要第一手的模板资料记得关注，也欢迎提建议，会及时采纳。

> 原文：[LaTeX 美赛模板【Demo 修正版】- ICMDemo2.0](https://blog.csdn.net/m0_66681776/article/details/122797387?spm=1011.2415.3001.5331) · 作者 m0_66681776
