---
title: 每日前端面经 · 2023-02-28
date: 2023-02-28
---

题目来源: [牛客](https://www.nowcoder.com/feed/main/detail/712fdb49a23a4d65ae6704407fb81349)

## 使用TS的目的

- 提供很好的智能提示
- 方便进行代码重构
- 明确定义参数类型和函数重载

## Type和Interface的区别

- type主要用于创建联合类型、交叉类型、以及定义复杂的类型别名
- interface主要用于定义对象和类的结构

## Any和泛型

虽然用any类型能够接收任何类型的参数，但是会丢失类型信息，此时就需要使用泛型

```ts
function identity(arg: any): any {}

function identity<T>(arg: T): T {}
```

## 对TS的理解

TS是JS的超集，支持ES6语法，和JAVA类似支持面对对象编程的概念，如类、接口、继承、泛型等。由于是超集，因为任何现有的JS代码都可以不加改变的在TS下工作

- 类型批注和编译时类型检查
- 类型推断
- 类型擦除
- 接口
- 枚举
- 混入
- 泛型
- 命名空间
- 元组
- ...

## Webpack的优化

- 代码分离: 配置多入口、动态导入、自定义分包
- CDN
- 提取CSS文件
- 打包文件命名
- 代码压缩
- Tree-Shaking
- 作用域提升
- 文件压缩

## 性能优化

- 浏览器
  - 减少HTTP请求
  - 使用HTTP2.0
  - 设置浏览器缓存策略
  - 白屏时间做加载动画
- 资源
  - 静态资源CDN
  - 静态资源单独域名
  - GZIP压缩
  - 做服务端渲染SSR
  - 将CSS放在头部，JS放在尾部
- 图片
  - 字体图标代替图片图标
  - 精灵图
  - 图片懒加载
  - 图片预加载
  - 使用PNG格式
  - 小于10KB的图片转为BASE64
- 代码
  - 慎用全局变量
  - 缓存全局变量
  - 减少回流与重绘
  - 节流防抖
  - 少用闭包
  - 减少数据读取次数
  - 文档碎片优化
  - 减少判断层级
- 项目
  - 长列表优化
  - web worker
  - 避免iframe
- 打包

## 查找白屏原因

- 判断网络连接是否通畅
- 判断网络地址是否输入有误
- 打开控制台查看报错信息
- 查看接口访问是否正常
- 查看路由是否有path/name的问题

## 前端工程化的目的

前端工程化是一种思想，主要目的是为了提高效率和降低成本，即提高开发过程中的开发效率并减少不必要的重复工作时间等。可以从模块化、组件化、规范化和自动化四个方面着手

## SourceMap为何vue能在浏览器直接显示报错行数

SourceMap的主要作用是为了方便调试，因为现在的前端代码都是模块化、组件化的，在上线前会对js和css文件进行合并、压缩、混淆，这样的代码难以调试。SourceMap的作用就是能让浏览器的调试面板将生成后的代码映射到源码文件中，使得开发者能够在源码中进行DEBUG

## Vue渲染原理

Vue的设计参考了MVVM架构，分为业务层、视图层以及绑定层，但并不完全符合MVVM，因为它没有严格意义上的绑定层。MVVM要求开发者将业务层和视图层分开：业务层负责管理数据；视图层负责页面渲染；绑定层负责双向绑定

Vue将组件转化成JS描述的虚拟DOM，然后调用原生对其进行挂载成真实DOM。Vue的执行过程主要分为两大阶段：Vue自身的初始化阶段和实例的生命周期管理阶段

## 节流防抖

- 防抖: 多次执行只执行最后一次
  ```js
  function debounce(func, delay) {
    let timeout
    return function () {
      const _this = this
      const _args = arguments
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(() => {
        func.apply(_this, _args)
      }, delay)
    }
  }
  ```
- 节流: 多次执行只执行第一次2
  ```js
  function throttle(func, wait) {
    let timeout
    return function () {
      const _this = this
      const _args = arguments
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = undefined
          func.apply(_this, _args)
        }, wait)
      }
    }
  }
  ```

[为什么要用TypeScript？代码详解ts给我们带来的收益](https://segmentfault.com/a/1190000040510267)  
[深入理解TypeScript中type和interface的区别与适用场景](https://cloud.tencent.com/developer/article/2358967)  
[TypeScript里的类型为any和泛型的区别](https://blog.csdn.net/i042416/article/details/108106413)  
[面试官：说说你对 TypeScript 的理解？与 JavaScript 的区别？](https://vue3js.cn/interview/typescript/typescript_javascript.html#%E4%B8%80%E3%80%81%E6%98%AF%E4%BB%80%E4%B9%88)  
[webpack性能优化方案(详细)](https://juejin.cn/post/7233298696292040741)  
[前端性能优化篇： 防抖和节流](https://juejin.cn/post/6958704784626941982)  
[超详细的Vue渲染原理讲解](https://blog.csdn.net/qq_41694291/article/details/108435096)  
[详解前端代码的sourceMap原理——让你不再为调试代码发愁](https://www.bilibili.com/read/cv5010987/#:~:text=sourceMa,%E7%A8%8B%E5%BA%8F%E5%91%98%E5%BC%80%E5%BF%83%E5%BE%88%E5%A4%9A%EF%BC%81)  
[谈谈你对前端工程化的理解](https://zhuanlan.zhihu.com/p/141195603)  
[前端面试题：页面出现空白，怎么排查定位问题？](https://segmentfault.com/q/1010000015669214)  
[web前端性能优化（全汇总）](https://juejin.cn/post/7029973323475845150)

```
新人发文，礼貌球馆💕
```
