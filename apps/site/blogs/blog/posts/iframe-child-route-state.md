---
title: Iframe 父子页面消息传递实战
description: 用 postMessage + localStorage 在刷新后恢复 iframe 内 Vue Router Hash 子路由状态。
date: 2026-11-01
---

# Iframe 父子页面消息传递实战

::: tip {title="项目链接"}
仓库：[xxhls/iframe-message](https://github.com/xxhls/iframe-message)
:::

::: info {title="你会得到什么"}
在 iframe 里跑 Hash 路由时，刷新后子路由会被重置；用父子 `postMessage` 把路由缓存到父页，刷新后再推回子页。
:::

![Iframe 父子路由保持示意](https://i-blog.csdnimg.cn/blog_migrate/24a55f6d90a2f5d11146c239f7032861.png)

## 1. 简介

iframe 用于在页面中内嵌另一个页面，可以实现技术栈无关的协同开发。本项目用 iframe 父子通信缓存子路由，并在页面刷新时由子页面读取最新保存的路由状态。

## 2. 背景

进入首页后，依次点击 Go to Apple、Go to Banana、Go to Orange，下方路由会正确渲染，浏览器的 Back 也正常。若停留在 Orange 路由刷新，iframe 内路由缓存丢失，被重置为首页。

要求：刷新后子页面路由保持原有状态。

## 3. 思路

1. 监听子页面路由变化，并通知父页面
2. 父页面缓存路由
3. 页面刷新后，父页面读取缓存，并发送给子页面
4. 子页面监听消息，将路由重定向到缓存

## 4. 源码

父页面：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>hash模式主页面</title>
    <style>
      html,
      body {
        width: 90%;
        height: 90%;
      }
      iframe {
        width: 90%;
        height: 90%;
      }
    </style>
  </head>
  <body>
    <h1>测试 HASH 模式子路由保持功能</h1>
    <iframe src="http://localhost:3000/child" id="iframeId" name="iframeName"></iframe>
    <script>
      // 2. 接收子页面路由消息
      window.addEventListener('message', e => {
        console.log('接收子页面消息：', e.data)
        // 3. 将子页面路由信息存入浏览器缓存
        window.localStorage.setItem('child_route', e.data)
      })
    </script>
    <script>
      // 4. 向子页面发送浏览器缓存的路由信息
      document.getElementById('iframeId').onload = function () {
        const child_route = window.localStorage.getItem('child_route')
        if (child_route) {
          console.log('向子页面发送消息：', child_route)
          iframeName.window.postMessage(child_route, 'http://localhost:3000/child')
          window.localStorage.removeItem('child_route')
        }
      }
    </script>
  </body>
</html>
```

子页面：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hash模式子页面</title>
    <script src="https://unpkg.com/vue@3"></script>
    <script src="https://unpkg.com/vue-router@4"></script>
  </head>
  <body>
    <div id="app">
      <h1>Hello App!</h1>
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

      const routes = [
        { path: '/', component: Home },
        { path: '/apple', component: Apple },
        { path: '/banana', component: Banana },
        { path: '/orange', component: Orange }
      ]

      const router = VueRouter.createRouter({
        history: VueRouter.createWebHashHistory(),
        routes
      })

      // 1. 向主页面发送消息
      router.beforeEach((to, from) => {
        if (to.fullPath === '/') return
        console.log('向主页面发送消息：', to.fullPath)
        window.top.postMessage(to.fullPath, 'http://localhost:3000')
      })

      // 5. 接收浏览器发送的路由缓存信息
      window.addEventListener('message', e => {
        console.log('接收主页面消息：', e.data)
        // 6. 跳转到缓存指向的页面
        router.push(e.data)
      })

      const app = Vue.createApp({})
      app.use(router)
      app.mount('#app')
    </script>
  </body>
</html>
```
