---
title: 每日前端面经 · 2024-03-03
date: 2024-03-03
---

题目来源: [牛客](https://www.nowcoder.com/feed/main/detail/a52f6d49d2ba47a7a2fa4088f971c7a2)

## 说说你对Vue3的理解？

- Vue2面对对象编程，Vue3函数时编程
- 对TS支持的更好
- 选项式API替代组合式API
- 响应式原理由Object.defineProperty变为Proxy
- 支持template中存在多个根节点
- 重写虚拟DOM
- 增加setup修饰符
- 支持tree-shaking，减小体积
- 组件渲染优化（Vue3支持单独渲染父子组件）
- Vue3使用createApp，Vue2使用new Vue()
- diff算法优化，使用静态树提升

## Vue如何实现的响应式

### Vue2

当把一个普通的JS对象传入Vue实例作为data选项，Vue将遍历此对象所有的属性并通过Object.defineProperty为其设置getter和setter，从而让Vue能够追踪依赖的变化，在被访问和修改时通知变更。每个组件实例都有一个wacher实例，会把渲染过程中需要的数据记录为依赖，当依赖项的setter触发时，会通知watch，然后把它关联的组件重新渲染

- Vue无法检测对象属性的添加或移除，可以使用vm.$set(obj, property, value)为响应式对象添加响应式属性
- Vue无法检测直接使用索引值设置数组项或修改数组长度，可以使用vm.$set(array, index, newValue)来响应式按索引修改属性值或者使用splice

### Vue3

Vue3采用Proxy和Reflect的方法拦截对对象的交互

```js
const exam = {
  name: 'TOM'
}
const handler = {
  get: function (target, property) {
    // 检查当前运行的副作用，并将当前属性添加为副作用的依赖——订阅
    track(target, property)
    return Reflect.get(target.key)
  },
  set: function (target, property, value) {
    // 触发以target.property为依赖的副作用进行更新——发布
    trigger(target, property)
    return Reflect.set(target, key, value)
  }
}
const proxy = new Proxy(exam, handler)
proxy.name = 'Jerry'
console.log(proxy.name)
```

## Vue生命周期

### Vue2

- beforeCreate: 组件初始化之后，进行数据侦听和事件/侦听器的配置之前执行
- created: 组件创建完成之后立即同步执行，已配置数据侦听、计算属性、方法等回调函数
- beforeMount: 挂载开始之前执行，相关的render函数首次被调用
- mounted: 组件挂载后执行，不能保证所有的子组件也都被挂载完毕
- beforeUpdate: 数据发生改变，DOM被更新之前执行
- updated: 数据更改导致虚拟DOM重新渲染和更新完毕之后调用
- activated: 被keep-alive缓存的组件激活时调用
- deactivated: 被keep-alive缓存的组件失活时调用
- beforeDestoryed: 组件销毁之前调用
- destoryed: 组件销毁之后调用
- errorCaptured: 捕获到后代组件的错误时调用

### Vue3

- onMounted: 组件挂载完毕后执行
- onUpdated: 组件因为响应式状态变更而更新其DOM树后执行
- onUnmounted: 组件卸载之后执行
- onBeforeMount: 组件挂载之前执行
- onBeforeUpdate: 组件因为响应式状态变更而更新其DOM树前执行
- onBeforeUnmount: 组件卸载之前执行
- onErrorCaptured: 捕获了后代组件传递的错误时执行
- onRenderTracked: 组件渲染过程中追踪到响应式依赖时调用
- onRenderTriggered: 组件响应式依赖的变更触发了组件渲染时调用
- onActivated: 若组件是keepAlice缓存树的一部分，当组件被插入到DOM中执行
- onDeactivated: 若组件是keepAlice缓存树的一部分，当组件被从DOM中移除执行
- onServerPrefetch: 组件实例在服务器上被渲染之前调用

## created和mounted这两个生命周期中请求数据的区别

created是在组件实例一旦创建完成的时候立刻调用，这时候页面dom节点并未生成mounted是在页面dom节点渲染完毕之后就立刻执行的触发时机上created是比mounted要更早的两者相同点：都能拿到实例对象的属性和方法讨论这个问题本质就是触发的时机，放在mounted请求有可能导致页面闪动（页面dom结构已经生成），但如果在页面加载前完成则不会出现此情况建议：放在create生命周期当中

## 对nextTick的理解

Vue在更新DOM时时异步执行的。当数据发生变化时，Vue将开启一个异步更新队列，视图需要等队列中所有数据变化完成之后，再统一进行更新

## 对slot的理解？slot使用场景有哪些？

Vue组件通过插槽的方式实现内容的分法，它允许我们在父组件中编写DOM并在子组件渲染时把DOM添加到子组件的插槽中，使用起来非常方便。在实现上，Vue组件的插槽内容会被编译为插槽函数，插槽函数的返回值就是向槽位填充的内容。`<slot>`标签则会被编译为插槽函数的调用，通过执行对应的插槽函数，得到外部向槽位填充的内容（即虚拟DOM），最后将该内容渲染到槽位中

通过插槽可以让用户可以拓展组件，去更好地复用组件和对其做定制化处理。如果父组件在使用到一个复用组件的时候，获取这个组件在不同地方有少量的更改，如果去重写组件是一件不明智的事情。通过slot插槽向组件内部指定位置传递内容，完成这个复用组件在不同场景的应用。比如布局组件、表格列、下拉选、弹框显示内容等

## 对前端工程化的理解

前端工程化是一种思想，主要目的是为了提高效率和降低成本，即提高开发过程中的开发效率并减少不必要的重复工作时间等。可以从模块化、组件化、规范化和自动化四个方面着手

## 项目优化

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

[面试官：你了解过Vue3吗？（Vue3知识点汇总）](https://cloud.tencent.com/developer/article/1948881)  
[Vue中的$nextTick有什么作用？说说你对$nextTick的理解](https://juejin.cn/post/7316968245574811699)  
[说说你对slot的理解？slot使用场景有哪些？](https://blog.csdn.net/webblock/article/details/111309987)  
[由浅入深，理解 Vue3 组件的插槽（slot）](https://juejin.cn/post/7340478055914209330)  
[谈谈你对生命周期的理解？在created和mounted这两个生命周期中请求数据有什么区别呢？](https://blog.csdn.net/weixin_45355998/article/details/121518607)

```
新人发文，礼貌求关❤️
```
