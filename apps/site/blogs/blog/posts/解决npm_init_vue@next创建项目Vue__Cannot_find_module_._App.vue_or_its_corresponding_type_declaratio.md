---
title: "解决npm init vue@next创建项目Vue: Cannot find module ./App.vue or its corresponding type declaratio"
author: "Ari He"
date: "于 2023-09-19 11:42:55 发布"
source: "https://blog.csdn.net/m0_66681776/article/details/133021078?spm=1011.2415.3001.5331"
---

打开创建后的env.d.ts




写入




```TypeScript
/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

---
> 原文链接: [解决npm init vue@next创建项目Vue: Cannot find module ./App.vue or its corresponding type declaratio](https://blog.csdn.net/m0_66681776/article/details/133021078?spm=1011.2415.3001.5331)
> 作者: Ari He
