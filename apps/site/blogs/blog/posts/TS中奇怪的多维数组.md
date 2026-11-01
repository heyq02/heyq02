---
title: "TS中奇怪的多维数组"
author: "Ari He"
date: "已于 2023-03-06 21:31:17 修改"
source: "https://blog.csdn.net/m0_66681776/article/details/129371202?spm=1011.2415.3001.5331"
---

```plaintext
作为JS的超集，TS严格的类型规定大部分时候能大大提高我们的编程效率，但是有时候也会出现很麻烦的场景。
```


1. 

## 问题情景



TS中创建数组需要用到泛型，我们以一维数组为例：


```typescript
const arr: Array<number> = []
 
arr[0] = 1
 
console.log(arr)
// [1]
```


然而对于二维数组却有一个很有意思的问题


```
领2年VIPtypescript运行
```


## 2.

---
> 原文链接: [TS中奇怪的多维数组](https://blog.csdn.net/m0_66681776/article/details/129371202?spm=1011.2415.3001.5331)
> 作者: Ari He
