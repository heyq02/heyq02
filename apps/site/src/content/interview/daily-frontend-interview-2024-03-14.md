---
title: 每日前端面经 · 2024-03-14
date: 2024-03-14
---

# 【每日前端面经】2024-03-14

欢迎订阅我的前端面经专栏: [每日前端面经](https://blog.csdn.net/m0_66681776/category_12583217.html)

本期题目来源: [牛客](https://www.nowcoder.com/feed/main/detail/45bad7a46197406b83b5158f54367fce)

## vite 为什么比 webpack 更快

- 开发模式：Webpack 是先打包再启动开发服务器，而 Vite 则是直接启动，然后再按需编译依赖文件
  - 使用 Webpack 时，所有的模块都需要在开发前进行打包，这会增加启动时间和构建时间
  - 而 Vite 则采用了不同的策略，它会在请求模块时再进行实时编译，这种按需动态编译的模式极大地缩短了编译时间，特别是在大型项目中，文件数量众多，Vite 的优势更为明显
- ESM：现代浏览器本身就支持 ES Modules，会主动发起请求去获取所需文件。Vite充分利用了这一点，将开发环境下的模块文件直接作为浏览器要执行的文件，而不是像 Webpack 那样先打包，再交给浏览器执行
- 底层原理：Webpack 是基于 Node.js 构建的，而 Vite 则是基于 esbuild 进行预构建依赖。esbuild 是采用 Go 语言编写的，Go 语言是纳秒级别的，而 Node.js 是毫秒级别的。因此，Vite 在打包速度上相比Webpack 有 10-100 倍的提升
- 热更新
  - 在 Webpack 中，当一个模块或其依赖的模块内容改变时，需要重新编译这些模块
  - 而在 Vite 中，当某个模块内容改变时，只需要让浏览器重新请求该模块即可，这大大减少了热更新的时间

## http 协议中 content-type 常用类型

- 常见的媒体格式类型如下：
  - text/html ： HTML格式
  - text/plain ：纯文本格式
  - text/xml ： XML格式
  - image/gif ：gif图片格式
  - image/jpeg ：jpg图片格式
  - image/png：png图片格式
- 以application开头的媒体格式类型：
  - application/xhtml+xml ：XHTML格式
  - application/xml： XML数据格式
  - application/atom+xml ：Atom XML聚合格式
  - application/json： JSON数据格式
  - application/pdf：pdf格式
  - application/msword ： Word文档格式
  - application/octet-stream ： 二进制流数据（如常见的文件下载）
  - application/x-www-form-urlencoded ： `<form encType=””>`中默认的encType，form表单数据被编码为key/value格式发送到服务器（表单默认的提交数据的格式）
- 上传文件：
  - multipart/form-data ： 需要在表单中进行文件上传时，就需要使用该格式

## 浏览器缓存

1. 浏览器发送请求前，根据请求头的 expires 和 cache-control 判断是否命中（包括是否过期）强缓存策略，如果命中，直接从缓存获取资源，并不会发送请求。如果没有命中，则进入下一步
2. 没有命中强缓存规则，浏览器会发送请求，根据请求头的 last-modified 和 etag 判断是否命中协商缓存，如果命中，直接从缓存获取资源。如果没有命中，则进入下一步
3. 如果前两步都没有命中，则直接从服务端获取资源。

## http 状态码

- 信息响应（100-199）
  - 100
  - 101
  - 102
  - 103
- 成功响应（200-299）
  - 200: 请求成功
  - 201
  - 202
  - 203
  - 205
  - 206
  - 207
  - 208
  - 226
- 重定向响应（300-399）
  - 300
  - 301
  - 302
  - 303
  - 304: 响应没有被修改，继续使用缓存
  - 307
  - 308
- 客户端错误响应（400-499）
  - 400
  - 401
  - 402
  - 403: 没有访问权限
  - 404: 找不到请求的资源
  - 405: 目标不支持请求方法
  - 406
  - ...
- 服务端错误响应（500-599）

## electron 有哪些部分

- net 模块: 实现了主机解析，cookies，网络改变探测，SSL，资源缓存，ftp，HTTP， OCSP实现，代理 (SOCKS和HTTP) 配置，解析，脚本获取（包括各种不同系统下实现），QUIC，socket池，SPDY，WebSockets等等
- v8 模块: 包括字节码解析器，JIT 编译器，多代GC，inspector (调试支持)，内存和 CPU 的 profiler（性能统计），WebAssembly 支持，两种 post-mortem diagnostics 的支持，启动快照，代码缓存、代码热点分析等等
- Skia 模块: 用点画出各种图。然而里面包括十几种矢量的绘制，文字绘制、GPU加速、矢量的指令录制以及回放（还要能支持线程安全）、各种图像格式的编解码、GPU渲染优化等等
- Blink 内核
- 还有音视频相关、沙箱、插件、UI等等

## 服务端渲染的原理

SSR 是 Server Side Render 简称；页面上的内容是通过服务端渲染生成的，浏览器直接显示服务端返回的html就可以了

- 更快的首屏加载：这一点在慢网速或者运行缓慢的设备上尤为重要。服务端渲染的 HTML 无需等到所有的 JavaScript 都下载并执行完成之后才显示，所以你的用户将会更快地看到完整渲染的页面。除此之外，数据获取过程在首次访问时在服务端完成，相比于从客户端获取，可能有更快的数据库连接。这通常可以带来更高的核心 Web 指标评分、更好的用户体验，而对于那些“首屏加载速度与转化率直接相关”的应用来说，这点可能至关重要
- 同一的心智模型：你可以使用相同的语言以及相同的声明式、面向组件的心智模型来开发整个应用，而不需要在后端模板系统和前端框架之间来回切换
- 更好的 SEO：搜索引擎爬虫可以直接看到完全渲染的页面

## 懒加载

懒加载，即延迟加载 Lazyload。简单来说就是一个长页面中需要展示很多图像的时候，如果在进入页面的时候一次性把所有图片加载完，需要很长的时间。为了提升用户体验，我们使用懒加载，当图片出现在浏览器可视区域时，才加载图片。例如各种电商页面

- 加快页面打开速度，提升用户体验
- 减少服务器压力和浏览器的负担

## 性能优化

- 浏览器
  - 减少HTTP请求
  - 使用HTTP2.0
  - 设置浏览器缓存
  - 白屏做加载动画
- 资源
  - 静态资源CDN
  - 静态资源单独域名
  - GZIP压缩
  - 做服务端渲染
  - 头部放置CSS，底部放置JS
- 图片
  - 字体图标代替图片图标
  - 精灵图
  - 图片懒加载
  - 图片预加载
  - 使用PNG格式的图片
  - 图片转BASE64格式
- 代码
  - 慎用全局变量
  - 缓存全局变量
  - 减少回流与重绘
  - 节流防抖
  - 少用闭包
  - 减少数据读取次数
  - 文档碎片优化节点
  - 减少判断层级
  - 字面量与构造式
- 项目
  - 长列表优化
  - web worker
  - 避免iframe
  - 打包
  - 减少代码体积
  - 按需加载
  - 提取第三方库代码
  - webpack dll优化

## vue3 比 vue2 的优化

- 性能: Vue3 在性能方面有了很大的提升，包括渲染速度和内存使用。它只会对渲染初始可见的部分数据创建观察者，以提高效率。此外，Vue3 还引入了变更通知的优化，只有依赖的属性的 watcher 才会重新运行，而不是所有 watcher
- 语法: Vue3 使用了新的语法，如 Composition API 和 Fragments。Composition API 允许更灵活地组合组件逻辑，而 Fragments 允许在模板中返回多个元素。这使得 Vue3 在代码组织和可读性方面更加优秀
- API: Vue3 的 API 与 Vue2 有所不同。Vue2 使用选项类型 API，而 Vue3 引入了 Composition API。这使得代码更加模块化，逻辑更加清晰
- 生命周期函数钩子: Vue3 的生命周期函数钩子与 Vue2 有所不同。Vue3 增加了一些新的钩子函数，如 onRenderTracked 和 onRenderTriggered，并在调用前需要先引入
- 数据双向绑定原理: Vue2 的双向数据绑定是利用 ES5 的 Object.defineProperty() 对数据进行劫持，结合发布订阅模式的方式来实现的。而 Vue3 则使用了 Proxy API 代理来实现数据双向绑定，这使得数据监听更加高效和全面
- 定义变量和方法: Vue3 提供了 setup 方法，在组件初始化构造的时候触发。使用 reactive 方法来声明数据为响应性数据，并通过 setup 方法返回响应性数据，从而 template 可以获取这些响应式数据。这与 Vue2 中将数据放入 data 中并在 methods 中定义方法的方式有所不同
- 指令和插槽的使用: Vue3 在指令和插槽的使用方面也有所变化，提供了更多的灵活性和功能
- 是否支持碎片: Vue3 支持碎片（Fragments），意味着它可以拥有多个根节点。而 Vue2 则不支持碎片
- 父子之间传参: Vue2 和 Vue3 在父子之间传参方面保持一致，都是使用 props 进行父传子，使用事件 Emitting Events 进行子传父
- Main.js: Vue3 在 main.js 文件中的设置与 Vue2 有所不同，包括新的创建应用实例的方式和一些配置选项的变化
- TS 和 PWA 支持程度: Vue3 新加入了 TypeScript 以及 PWA 支持，这使得开发者可以使用 TypeScript 编写更加严谨和可维护的代码，并且可以将 Vue 应用打包成 PWA 应用，提高应用的性能和用户体验

## vue3 响应式原理

Vue 独特的响应式系统：当 JavaScript 对象发生变化时，视图会自动更新。核心设计思想是数据劫持+观察者模式

1. Vue 使用了一个名为 Observer 的类来实现数据劫持。当创建 Vue 实例时，Vue 会遍历传入的数据对象，对其进行递归遍历将其转化为响应式属性
2. 当属性转化为响应式属性时，Vue 会为每个属性创建一个 Dep 依赖对象，用于收集当前属性的依赖关系
3. 当访问一个响应式属性时，Vue 会在访问过程中收集依赖，将当前属性和对应的 Watcher 对象关联起来
4. 当属性发生变化时，Vue 会通知该属性的 Dep 依赖对象，然后依赖对象遍历其依赖列表没通知每个依赖的 Watcher 对象进行更新操作

- 方法1：Object.defineProperty 实现

```js
function render() {
  console.log('模拟视图渲染')
}
let obj = [1, 2, 3]
let methods = ['pop', 'shift', 'unshift', 'sort', 'reverse', 'splice', 'push']
// 先获取到原来的原型上的方法
let arrayProto = Array.prototype
// 创建一个自己的原型 并且重写methods这些方法
let proto = Object.create(arrayProto)
methods.forEach(method => {
  proto[method] = function () {
    // AOP
    arrayProto[method].call(this, ...arguments)
    render()
  }
})
function observer(obj) {
  // 把所有的属性定义成set/get的方式
  if (Array.isArray(obj)) {
    obj.__proto__ = proto
    return
  }
  if (typeof obj == 'object') {
    for (let key in obj) {
      defineReactive(obj, key, obj[key])
    }
  }
}
function defineReactive(data, key, value) {
  observer(value)
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newValue) {
      observer(newValue)
      if (newValue !== value) {
        render()
        value = newValue
      }
    }
  })
}
observer(obj)
function $set(data, key, value) {
  defineReactive(data, key, value)
}
obj.push(123, 55)
console.log(obj) //[1, 2, 3, 123,  55]
```

- 方法3：Proxy 实现

```js
function render() {
  console.log('模拟视图的更新')
}
let obj = {
  name: '前端工匠',
  age: { age: 100 },
  arr: [1, 2, 3]
}
let handler = {
  get(target, key) {
    // 如果取的值是对象就在对这个对象进行数据劫持
    if (typeof target[key] == 'object' && target[key] !== null) {
      return new Proxy(target[key], handler)
    }
    return Reflect.get(target, key)
  },
  set(target, key, value) {
    if (key === 'length') return true
    render()
    return Reflect.set(target, key, value)
  }
}

let proxy = new Proxy(obj, handler)
proxy.age.name = '浪里行舟' // 支持新增属性
console.log(proxy.age.name) // 模拟视图的更新 浪里行舟
proxy.arr[0] = '浪里行舟' //支持数组的内容发生变化
console.log(proxy.arr) // 模拟视图的更新 ['浪里行舟', 2, 3 ]
proxy.arr.length-- // 无效
```

## 参考资料

[深入浅出Vue响应式原理（完整版）](https://juejin.cn/post/6844903882208837640#heading-14)  
[超简单直观理解懒加载（Lazyload）](https://blog.csdn.net/weixin_41966912/article/details/88580857)  
[Vue官方文档](https://cn.vuejs.org/guide)  
[深入理解Electron（一）Electron架构介绍](https://zhuanlan.zhihu.com/p/604169213)  
[浏览器缓存看这一篇就够了](https://zhuanlan.zhihu.com/p/60950750)  
[菜鸟教程](https://www.runoob.com)  
[面试常问：为什么 Vite 速度比 webpack 快？](https://blog.csdn.net/chenyajundd/article/details/136629280#:~:text=%E6%80%BB%E7%9A%84%E6%9D%A5%E8%AF%B4%EF%BC%8CVite%20%E4%B9%8B%E6%89%80%E4%BB%A5%E6%AF%94%20Webpack%20%E5%BF%AB%EF%BC%8C%E4%B8%BB%E8%A6%81%E6%98%AF%E5%9B%A0%E4%B8%BA%E5%AE%83%E9%87%87%E7%94%A8%E4%BA%86%E4%B8%8D%E5%90%8C%E7%9A%84%E5%BC%80%E5%8F%91%E6%A8%A1%E5%BC%8F%E3%80%81%E5%85%85%E5%88%86%E5%88%A9%E7%94%A8%E4%BA%86%E7%8E%B0%E4%BB%A3%E6%B5%8F%E8%A7%88%E5%99%A8%E7%9A%84,ES%20Modules%20%E6%94%AF%E6%8C%81%E3%80%81%E4%BD%BF%E7%94%A8%E4%BA%86%E6%9B%B4%E9%AB%98%E6%95%88%E7%9A%84%E5%BA%95%E5%B1%82%E8%AF%AD%E8%A8%80%EF%BC%8C%E5%B9%B6%E4%BC%98%E5%8C%96%E4%BA%86%E7%83%AD%E6%9B%B4%E6%96%B0%E7%9A%84%E5%A4%84%E7%90%86%E3%80%82%20%E8%BF%99%E4%BA%9B%E7%89%B9%E7%82%B9%E4%BD%BF%E5%BE%97%20Vite%E5%9C%A8%E5%A4%A7%E5%9E%8B%E9%A1%B9%E7%9B%AE%E4%B8%AD%E5%85%B7%E6%9C%89%E6%98%BE%E8%91%97%E7%9A%84%E4%BC%98%E5%8A%BF%EF%BC%8C%E8%83%BD%E5%A4%9F%E5%BF%AB%E9%80%9F%E5%90%AF%E5%8A%A8%E5%92%8C%E6%9E%84%E5%BB%BA%EF%BC%8C%E6%8F%90%E9%AB%98%E5%BC%80%E5%8F%91%E6%95%88%E7%8E%87%E3%80%82)

```txt
新人发文，礼貌求关❤️
```
