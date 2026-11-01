---
title: TS 中奇怪的多维数组
description: TypeScript 里二维数组的类型声明与赋值限制，以及实际写法上的取舍。
date: 2023-03-06
---

# TS 中奇怪的多维数组

作为 JS 的超集，TS 严格的类型规定大部分时候能大大提高我们的编程效率，但是有时候也会出现很麻烦的场景。

## 问题情景

TS 中创建数组需要用到泛型，我们以一维数组为例：

```typescript
const arr: Array<number> = []

arr[0] = 1

console.log(arr)
// [1]
```

然而对于二维数组却有一个很有意思的问题。

> 原文：[TS中奇怪的多维数组](https://blog.csdn.net/m0_66681776/article/details/129371202?spm=1011.2415.3001.5331) · 作者 m0_66681776
