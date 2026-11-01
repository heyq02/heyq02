---
title: 解决 npm init vue@next 报错 Cannot find module './App.vue'
description: 补上 env.d.ts 里的 *.vue 模块声明，解决新建 Vue3 项目时的类型报错。
date: 2023-09-19
---

# 解决 npm init vue@next 报错 Cannot find module './App.vue'

打开创建后的 `env.d.ts` 文件，写入以下声明：

```ts
/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```
