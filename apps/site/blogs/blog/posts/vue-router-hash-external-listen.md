---
title: 探究对 Vue Router Hash 模式的外部监听（未实现）
description: 为什么给 window 挂 hashchange 监听不到 Vue Router 的 Hash 跳转，以及它实际走的是 pushState / replaceState。
date: 2026-11-01
---

# 探究对 Vue Router Hash 模式的外部监听（未实现）

::: info {title="你会得到什么"}
搞清 Vue Router Hash「看起来改了 hash，却不触发 `hashchange`」的原因，以及为何原生很难直接监听 `pushState` / `replaceState`。
:::

常见印象是：Hash 模式靠 `hashchange` 切换组件。真实场景里却经常出现「`hashchange` 无效」——下面是一串排查实践。

## 1. 搭建 Demo

用 `serve` 起一个本地静态服务，暴露单个 HTML 即可：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hash路由问题</title>
    <script src="http://localhost:3000/libs/vue.global.js"></script>
    <script src="http://localhost:3000/libs/vue-router.global.js"></script>
  </head>
  <body>
    <div id="app">
      <h1>Vue Router</h1>
      <p>
        <router-link to="/">主页</router-link>
        <router-link to="/apple">Go to Apple</router-link>
        <router-link to="/banana">Go to Banana</router-link>
        <router-link to="/orange">Go to Orange</router-link>
      </p>
      <p>下方为路由页面</p>
      <router-view></router-view>
    </div>
    <script>
      const Home = { template: '<div>水果</div>' }
      const Apple = { template: '<div>Apple</div>' }
      const Banana = { template: '<div>Banana</div>' }
      const Orange = { template: '<div>Orange</div>' }

      const router = VueRouter.createRouter({
        history: VueRouter.createWebHashHistory(),
        routes: [
          { path: '/', component: Home },
          { path: '/apple', component: Apple },
          { path: '/banana', component: Banana },
          { path: '/orange', component: Orange }
        ]
      })

      const app = Vue.createApp({})
      app.use(router)
      app.mount('#app')
    </script>
  </body>
</html>
```

## 2. 测试 hashchange

```js
window.addEventListener('hashchange', () => {
  console.log('页面 Hash 值发生变化！')
})
```

给 `window` 挂上监听后，实际操作下来没有任何输出：

![hashchange 未触发](https://i-blog.csdnimg.cn/blog_migrate/0e462e0c2633a222982bd14473a11af7.png)

怎么改路由都触发不了；控制台输入 `location.hash` 却能看到 hash 已经变了：

![location.hash 已变化](https://i-blog.csdnimg.cn/blog_migrate/a0746bd00479a7ca0f5d995db53d41ae.png)

## 3. 探究原因

相关讨论见：[SegmentFault 问答](https://segmentfault.com/q/1010000040105060)。

vue-router 的 hash 表面上在改 hash，实际调用的是 `pushState` / `replaceState`，可以在**不触发 `hashchange`** 的情况下替换 hash。

## 4. 寻求新方法

既然走的是 `pushState` / `replaceState`，那就监听这两个——很遗憾，浏览器原生并不提供对应事件。原生有的是 `popstate`：`back()` 会触发，`pushState` / `replaceState` 不会。

在 Vue Router 源码里可以看到，它手动包装了 `pushState` / `replaceState`，并自己维护 listeners，从而实现路由跳转（节选）：

```js
function useHistoryListeners(base, historyState, currentLocation, replace) {
  let listeners = []
  let teardowns = []
  let pauseState = null
  const popStateHandler = ({ state }) => {
    const to = createCurrentLocation(base, location)
    const from = currentLocation.value
    const fromState = historyState.value
    let delta = 0
    if (state) {
      currentLocation.value = to
      historyState.value = state
      if (pauseState && pauseState === from) {
        pauseState = null
        return
      }
      delta = fromState ? state.position - fromState.position : 0
    } else {
      replace(to)
    }
    listeners.forEach(listener => {
      listener(currentLocation.value, from, {
        delta,
        type: NavigationType.pop,
        direction: delta
          ? delta > 0
            ? NavigationDirection.forward
            : NavigationDirection.back
          : NavigationDirection.unknown
      })
    })
  }
  // ...
  window.addEventListener('popstate', popStateHandler)
  return { pauseListeners, listen, destroy }
}
```

## 5. 结语

这次把 Vue Router Hash 的实现摸得更清楚一些。若你有在外部可靠监听其 hash 变化的思路，欢迎私信交流。
