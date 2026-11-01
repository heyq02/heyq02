---
title: LaTeX 美赛模板 Demo 2.0 修正版
description: 在 Demo 1.0 基础上给一级标题加引导线、把附录和参考文献纳入目录并给目录加超链接，编译出的论文更整齐。
date: 2023-02-26
---

# LaTeX 美赛模板 Demo 2.0 修正版

本次修正在原有的基础上，新增功能：给一级标题插入引导线、将附录以及置入目录，给目录设置超链接。编译出的论文更加美观，使用更加便捷。

---

## 一、新增功能

### 1.一级标题插入引导线

Demo1.0版本中我们直接使用\tableofcontents创建目录，然而这样出来的目录中的一级标题是缺失引导线的。这里，我们使用\usepackage{titletoc}包可以给一级标题创建引导线，样图如下：

> \usepackage{titletoc} \titlecontents{section}[1em]{\bfseries \large}{\contentslabel{4em}}{}{~\titlerule*[0.6pc]{$.$}~\contentspage} \titlecontents{subsection}[4em]{}{\contentslabel{4em}}{}{~\titlerule*[0.6pc]{$.$}~\contentspage} \titlecontents{subsubsection}[7em]{}{\contentslabel{4em}}{}{~\titlerule*[0.6pc]{$.$}~\contentspage}

![](https://i-blog.csdnimg.cn/blog_migrate/f5d0de478a3040c7cff40ae28cf14b70.png)

### 2.将附录以及参考置入目录中

一开始我们采用的是通过\begin{}生成附录和参考资料，然而这样生成的目录中Appendix和显得格格不入。这次我们采用\section{}的方式，直接将Appendix与Reference作为一级标题插入。同时，为了便于书写，使用\itemize给参考资料增加引导。

> \section{Reference} \begin{itemize}      \item[ [ 1]] D.~E.KNUTH  The \TeX book the American Mathematical Society and Addison-Wesley Publishing Company, 1984-1986.      \item[ [ 2]] Lamport, Leslie, \LaTeX: "A Document Preparation System", Addison-Wesley Publishing Company, 1986.      \item[ [ 3]] \url{https://www.latexstudio.net/}  \end{itemize}\begin{itemize}      \item[ [ 1]] D.~E.KNUTH  The \TeX book the American Mathematical Society and Addison-Wesley Publishing Company, 1984-1986.      \item[ [ 2]] Lamport, Leslie, \LaTeX: "A Document Preparation System", Addison-Wesley Publishing Company, 1986.      \item[ [ 3]] \url{https://www.latexstudio.net/}  \end{itemize}
> \section{Appendix}

![](https://i-blog.csdnimg.cn/blog_migrate/0233466f5c072d9ea8550a7466b000f6.png)

###  3.给目录设置

这一功能的实现较为简单，只需要在原有的基础上增添宏包\usepackage{hyperref}即可

## 二、模板

Demo1.0下载及使用地址可参考我的第一篇博文[美赛模板以及TeXPage使用指南_m0_66681776的博客-CSDN博客](https://blog.csdn.net/m0_66681776/article/details/122752970?spm=1001.2014.3001.5501)，与之相比，Demo2.0仅仅优化了代码，对于附件的引用并无修改，只需要在使用时将以下代码粘贴在原来Demo1.0位置处（不需要保留原有代码）。

> \documentclass{mcmthesis} \mcmsetup{CTeX=false,     tcn=2214237,problem=E,     sheet=true,titleinsheet=true,keywordsinsheet=true,     titlepage=false,abstract=true} %抬头区域 \usepackage{newtxtext} \usepackage{lipsum} \usepackage{hyperref} \usepackage{titletoc} \titlecontents{section}[1em]{\bfseries \large}{\contentslabel{4em}}{}{~\titlerule*[0.6pc]{$.$}~\contentspage} \titlecontents{subsection}[4em]{}{\contentslabel{4em}}{}{~\titlerule*[0.6pc]{$.$}~\contentspage} \titlecontents{subsubsection}[7em]{}{\contentslabel{4em}}{}{~\titlerule*[0.6pc]{$.$}~\contentspage} \title{The\LaTeX{}Template for MCM Version \MCMversion} %标题书写区域 \author{\small\href{http://www.latexstudio.net/}     {\includegraphics[width=7cm]{mcmthesis-logo}}} \date{\today} \begin{document} \begin{abstract}     Use this template to begin typing the first page (summary page) of your electronic report. This template uses a 12-point Times New Roman font. Submit your paper as an Adobe PDF electronic file (e.g. 111111.pdf), typed in English, with a readable font of at least 12-point type.          Do not include the name of your school, advisor, of team members on this or any page.          Papers must be within the 25 page limit.          Be sure to change the control number and problem choice above.     You may delete these instructions as you begin to type your report here          Follow us @COMAPMath on Twitter or COMAPCHINAOFFICIAL on Weibo for the most up to date contest information.      \begin{keywords} keyword1;keyword2 \end{keywords} \end{abstract} %摘要书写区域 \maketitle \tableofcontents
> \newpage\section{Introduction} \subsection{Background} \LaTeX{} is a document preparation system which uses the \TeX typesetting program. It enables you to produce publication-quality documents with great accuracy and consistency. \LaTeX works on any computer and produces industry-standard PDF. It is available both in free(open-source) of document, but it is especially suited to those with comples mathematics. Install the software from \url{www.tug.org/texlive}. \subsection{Previous Research} \subsection{Our Work} \lipsum[3] %生成随机段落 \begin{itemize}      \item the angular velocity of the bat,      \item the velocity of the ball, and      \item the position of impact along the bat.  \end{itemize}\begin{itemize}      \item the angular velocity of the bat,      \item the velocity of the ball, and      \item the position of impact along the bat.  \end{itemize} %小标题标记 \lipsum[4] %生成随机段落 \emph{center of percussion}[Brody 1986] %斜体英文 ,\lipsum[5]
> \begin{Theorem}  \label{thm:latex}  \LaTeX  \end{Theorem}\begin{Theorem}  \label{thm:latex}  \LaTeX  \end{Theorem} \begin{Lemma}  \label{thm:tex}  \TeX  \end{Lemma}\begin{Lemma}  \label{thm:tex}  \TeX  \end{Lemma} \begin{proof}  The proof of theorem.  \end{proof}\begin{proof}  The proof of theorem.  \end{proof} \section{General Assumptions} \lipsum[6] \begin{itemize}  \item  \item  \item  \item  \end{itemize}\begin{itemize}  \item  \item  \item  \item  \end{itemize} \lipsum[7] \section{Analysis of the Problem} \begin{figure}[h]  \small  \centering  \includegraphics[width=8cm]{example-image-a}  \caption{The name of figure}\label{fig:aa} %图片标题  \end{figure}\begin{figure}[h]  \small  \centering  \includegraphics[width=8cm]{example-image-a}  \caption{The name of figure}\label{fig:aa} %图片标题  \end{figure} %插入图片PDF \lipsum[8](???)(???) \begin{equation}      a^2\label{aa} %给公式标记  \end{equation}\begin{equation}      a^2\label{aa} %给公式标记  \end{equation} %插入公式 ⎛⎝⎜⎜∗20ca11a21a31a12a22a32a13a23a33⎞⎠⎟⎟(∗20ca11a12a13a21a22a23a31a32a33) \lipsum[9] pj={0,r!(−1)j/2,if j is oddif j is evenpj={0,if j is oddr!(−1)j/2,if j is even \lipsum[10] arcsinθ=∫∫∫⨀φlimx→∞n!r!(n−r)!\eqno(1)arcsin⁡θ=∫∫∫⨀φ⁡limx→∞⁡n!r!(n−r)!\eqno(1) \section{Calculating and Simplifying the Model } \lipsum[11] \section{The Model Results} \lipsum[6] \section{Validating the Model|} \lipsum[9] \section{A Summary} \lipsum[6] \section{Evaluate of the Model} \section{Strength and Weakness} \subsection{Strength} \subsection{Weakness} \begin{itemize}      \item \textbf{Applies widely}\\      This system can be used for man types of airplanes, and it alse solves the interference during the procedure of boarding airplane, as described above we can get to the optimization boarding time. We also know that all the service is automate.      \item\textbf{Improve ths quality of the airport service}\\      Balancing the cost of the cost and the benefit, it will bring in more convenient for airport and passengers. Lt also saves many human resources for the airline.      \item\textbf{}  \end{itemize}\begin{itemize}      \item \textbf{Applies widely}\\      This system can be used for man types of airplanes, and it alse solves the interference during the procedure of boarding airplane, as described above we can get to the optimization boarding time. We also know that all the service is automate.      \item\textbf{Improve ths quality of the airport service}\\      Balancing the cost of the cost and the benefit, it will bring in more convenient for airport and passengers. Lt also saves many human resources for the airline.      \item\textbf{}  \end{itemize} \section{Conclusion} \section{Reference} \begin{itemize}      \item[ [ 1]] D.~E.KNUTH  The \TeX book the American Mathematical Society and Addison-Wesley Publishing Company, 1984-1986.      \item[ [ 2]] Lamport, Leslie, \LaTeX: "A Document Preparation System", Addison-Wesley Publishing Company, 1986.      \item[ [ 3]] \url{https://www.latexstudio.net/}  \end{itemize}\begin{itemize}      \item[ [ 1]] D.~E.KNUTH  The \TeX book the American Mathematical Society and Addison-Wesley Publishing Company, 1984-1986.      \item[ [ 2]] Lamport, Leslie, \LaTeX: "A Document Preparation System", Addison-Wesley Publishing Company, 1986.      \item[ [ 3]] \url{https://www.latexstudio.net/}  \end{itemize} \section{Appendix} \subsection{First appendix} In addition, your report must include a letter to the Chief Financial Officer (CFO) of the Goodgrant Foundation, Mr.Alpha Chiang, that describes the optimal investment strategy, your modeling approach and major results, and a biref dicussion of your proposed concept of a return-on-investment (ROI). This letter should be no more than two pages in length. \begin{letter}{Dear, Mr.Alpha Chiang} \lipsum[1-2]
> \vspace{\parskip} Sincerely yours,
> Your friends \end{letter}
> Here are simulation programmes we used in our model as follow:\\ \textbf{\textcolor[rgb]{0.98,0.00,0.00}{Input matlab source:}} \lstinputlisting[language=Matlab]{mcmthesis-matlab1.m}
> \subsection{Second appendix} some more text \textcolor[rgb]{0.98,0.00,0.00}{\textbf{Input C++ source:}} \lstinputlisting[language=C++]{mcmthesis-sudoku.cpp}
> \end{document}

## 结语

博主会对美赛Demo不断优化更新，如果想要第一手的模板资料，记得关注哦，同时也欢迎咨询以及提出建议，我会及时采纳并更新的

---
> 原文链接: [LaTeX美赛模板【Demo修正版】- ICMDemo2.0](https://blog.csdn.net/m0_66681776/article/details/122797387?spm=1011.2415.3001.5331)
> 作者: m0_66681776
