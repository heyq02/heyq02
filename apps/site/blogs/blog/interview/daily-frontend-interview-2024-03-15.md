---
title: 每日前端面经 · 2024-03-15
date: 2024-03-15
---

# 【每日前端面经】2024-03-15

欢迎订阅我的前端面经专栏: [每日前端面经](https://blog.csdn.net/m0_66681776/category_12583217.html)

本期题目来源: [牛客](https://www.nowcoder.com/discuss/598189090026156032)

## vue2 和 vue3 的区别

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

## vue 底层实现响应式

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

## vite 的特点以及底层实现

先启动开发服务器，利用新一代浏览器的ESM能力，无需打包，直接请求所需模块并实时编译。HMR 时只需让浏览器重新请求该模块，同时利用浏览器的缓存（源码模块协商缓存，依赖模块强缓存）来优化请求

### 开发环境

开发环境不需要对所有资源打包，只是使用 esbuild 对依赖进行预构建，将 CommonJS 和 UMD 发布的依赖转换为浏览器支持的 ESM ，同时提高了后续页面的加载性能（lodash 的请求）。Vite 会将构建的依赖缓存到 node_modules/.vite 目录下，它会根据几个源来决定是否需要重新运行预构建，包括 packages.json 中的 dependencies 列表、包管理器的 lockfile、可能在 vite.config.js 相关字段中配置过的。只要三者之一发生改变，才会重新预构建

同时，开发环境使用了浏览器缓存技术，解析后的依赖请求以 http 头的 max-age=31536000, immutable 强缓存，以提高页面性能

### 生产环境

在生产环境，由于嵌套导入会导致发送大量的网络请求，即使使用 HTTP2.x（多路复用、首部压缩），在生产环境中发布未打包的 ESM 仍然性能低下。因此，对比在开发环境 Vite 使用 esbuild 来构建依赖，生产环境 Vite 则使用了更加成熟的 Rollup 来完成整个打包过程。因为 esbuild 虽然快，但针对应用级别的代码分割、CSS 处理仍然不够稳定，同时也未能兼容一些未提供 ESM 的 SDK

为了在生产环境中获得最佳的加载性能，仍然需要对代码进行 tree-shaking、懒加载以及 chunk 分割（以获得更好的缓存）

## 原生 js 实现路由

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
    <meta name="author" content="" />
    <title>原生模拟 Vue 路由切换</title>
    <style type="text/css">
      .router_box,
      #router-view {
        max-width: 1000px;
        margin: 50px auto;
        padding: 0 20px;
      }

      .router_box > a {
        padding: 0 10px;
        color: #42b983;
      }
    </style>
  </head>

  <body>
    <div class="router_box">
      <a href="/home" class="router">主页</a>
      <a href="/news" class="router">新闻</a>
      <a href="/team" class="router">团队</a>
      <a href="/about" class="router">关于</a>
    </div>
    <div id="router-view"></div>
    <script type="text/javascript">
      function Vue(parameters) {
        let vue = {}
        vue.routes = parameters.routes || []
        vue.init = function () {
          document.querySelectorAll('.router').forEach((item, index) => {
            item.addEventListener(
              'click',
              function (e) {
                let event = e || window.event
                event.preventDefault()
                window.location.hash = this.getAttribute('href')
              },
              false
            )
          })

          window.addEventListener('hashchange', () => {
            vue.routerChange()
          })

          vue.routerChange()
        }
        vue.routerChange = () => {
          let nowHash = window.location.hash
          let index = vue.routes.findIndex((item, index) => {
            return nowHash == '#' + item.path
          })
          if (index >= 0) {
            document.querySelector('#router-view').innerHTML = vue.routes[index].component
          } else {
            let defaultIndex = vue.routes.findIndex((item, index) => {
              return item.path == '*'
            })
            if (defaultIndex >= 0) {
              window.location.hash = vue.routes[defaultIndex].redirect
            }
          }
        }

        vue.init()
      }

      new Vue({
        routes: [
          {
            path: '/home',
            component: '<h1>主页</h1'
          },
          {
            path: '/news',
            component: '<h1>新闻</h1>'
          },
          {
            path: '/team',
            component: '<h1>团队</h1'
          },
          {
            path: '/about',
            component: '<h1>关于</h1>'
          },
          {
            path: '*',
            redirect: '/home'
          }
        ]
      })
    </script>
  </body>
</html>
```

## react 和 vue 的区别和相似处

- vue 提供了一系列的 api， 而 react 的 api 很少
- vue 的思想是响应式的，也就是基于是数据可变的，实现了数据的双向绑定，react 整体是函数式的思想，是单向数据流，推崇结合 immutable 来实现数据不可变
- vue 采用了 template， react采用了 jsx （本质上都是模版）
- react 依赖 Virtual DOM，而 Vue.js 使用的是 DOM 模板
- react 采用的 Virtual DOM 会对渲染出来的结果做脏检查。
- vue 在模板中提供了指令，过滤器等，可以非常方便，快捷地操作 DOM

## jsx 如何编译成 js 代码

- 通过 parser 把源代码转换成 AST
- 通过遍历 AST，调用各种插件对 AST 进行转换，包括一些语法转换、代码优化等，最终生成新的 AST
- 把转换后的 AST 转换成 js 代码并生成 sourcemap

## 怎么编译 typescript

1. 安装 typescript 编译器
2. 创建 tsconfig.json 配置编译器
3. 编写 ts 代码
4. 编译 ts 代码
5. 编译器会对 typescript 代码进行类型检查
6. 编译器会将 typescript 转换成 js 代码
7. 编译器根据 typescript 生成 .d.ts 声明文件

## 前端向后端发起 http 请求的整个过程

1. 建立请求: 客户端通过 TCP/IP 与服务器建立连接
2. 发送请求: 客户端向服务器发送一个 http 请求，其中包含请求方法和要访问的资源的URL
3. 处理请求: 服务器接收到请求后，会解析请求，查询所请求的资源，并准备好将其发送回客户端
4. 发送响应: 服务器将响应发送回客户端，通常包括状态码、响应头和响应体
5. 关闭连接: 连接在请求和响应之后通常会被关闭

## 参考资料

[Vite介绍及实现原理<超详细、纯干货！>](https://zhuanlan.zhihu.com/p/424842555)

[深入了解HTTP：从请求到响应的全过程](https://cloud.tencent.com/developer/article/2329256)

[原生 js 实现一个前端路由 router](https://zhuanlan.zhihu.com/p/55984543)

```txt
新人发文，礼貌求关❤️
```
