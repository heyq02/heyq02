---
title: 每日前端面经 · 2024-03-07
date: 2024-03-07
---

# 【每日前端面经】2024-03-07

欢迎订阅我的前端面经专栏: [每日前端面经](https://blog.csdn.net/m0_66681776/category_12583217.html)

本期题目来源: [牛客](https://www.nowcoder.com/feed/main/detail/866b99d7180747cd9918358451078d07?sourceSSR=users)

## 权限管理系统怎么设计

权限管理是所有后台系统的都会涉及的一个重要组成部分，主要目的是对不同的人访问资源进行权限的控制，避免因权限控制缺失或操作不当引发的风险问题，如操作错误，隐私数据泄露等问题

RBAC 是最基础也是最核心的模型，它包括用户/角色/权限，其中用户和角色是多对多的关系，角色和权限也是多对多的关系

- **用户**是发起操作的主体，按类型分可分为2B和2C用户，可以是后台管理系统的用户，可以是OA系统的内部员工，也可以是面向C端的用户，比如阿里云的用户
- **角色**起到了桥梁的作用，连接了用户和权限的关系，每个角色可以关联多个权限，同时一个用户关联多个角色，那么这个用户就有了多个角色的多个权限。有人会问了为什么用户不直接关联权限呢?在用户基数小的系统，比如20个人的小系统，管理员可以直接把用户和权限关联，工作量并不大，选择一个用户勾选下需要的权限就完事了。但是在实际企业系统中，用户基数比较大，其中很多人的权限都是一样的，就是个普通访问权限，如果管理员给100人甚至更多授权，工作量巨大。这就引入了"角色(Role)"概念，一个角色可以与多个用户关联，管理员只需要把该角色赋予用户，那么用户就有了该角色下的所有权限，这样设计既提升了效率，也有很大的拓展性
- **权限**是用户可以访问的资源，包括页面权限，操作权限，数据权限:
  - 页面权限: 即用户登录系统可以看到的页面，由菜单来控制，菜单包括一级菜单和二级菜单，只要用户有一级和二级菜单的权限，那么用户就可以访问页面
  - 操作权限: 即页面的功能按钮，包括查看，新增，修改，删除，审核等，用户点击删除按钮时，后台会校验用户角色下的所有权限是否包含该删除权限，如果是，就可以进行下一步操作，反之提示无权限。有的系统要求"可见即可操作"，意思是如果页面上能够看到操作按钮，那么用户就可以操作，要实现此需求，这里就需要前端来配合，前端开发把用户的权限信息缓存，在页面判断用户是否包含此权限，如果有，就显示该按钮，如果没有，就隐藏该按钮。某种程度上提升了用户体验，但是在实际场景可自行选择是否需要这样做
  - 数据权限: 数据权限就是用户在同一页面看到的数据是不同的，比如财务部只能看到其部门下的用户数据，采购部只看采购部的数据，在一些大型的公司，全国有很多城市和分公司，比如杭州用户登录系统只能看到杭州的数据，上海用户只能看到上海的数据，解决方案一般是把数据和具体的组织架构关联起来，举个例子，再给用户授权的时候，用户选择某个角色同时绑定组织如财务部或者合肥分公司，那么该用户就有了该角色下财务部或合肥分公司下的的数据权限

## ElementUI 怎么修改样式

- style + scoped 标签
- deep 样式穿透
- css 变量

## ES6 新特性

- Symbol 新类型
- let 和 const
- 解构赋值
- Map 和 Set
- 变量名和属性之相同可以省略
- 对象拓展运算符
- 对象新方法 assign 和 is
- 字符串新方法 includes startsWith endsWith repeat padStart padEnd
- 数组新方法 of from find findIndex fill copyWithin
- 函数参数默认值
- 不定参数
- 箭头函数
- class 类
- extends 继承
- 模块化导入导出
- Promise
- Proxy 和 Reflect

## this 指向

- 全局作用域: 指向 window
- 箭头函数: 指向创建时上下文的this
- 事件绑定: 指向事件源
- 定时器: 指向 window
- 构造函数: 指向新创建的对象
- 对象方法: 指向调用的对象

## 数组的方法

- Array.isArray(arr)
- arr.toString()
- arr.valueOf()
- arr.push(n): 末尾添加 n
- arr.unshift(n): 开头添加 n
- arr.pop(): 删除最后一项
- arr.shift(): 删除第一项
- arr.reverse(): 翻转数组
- arr.join()
- arr.sort(fc): 若 fc 的返回值 > 0 则交换值
- arr.concat()
- arr.slice()
- arr.indexOf(n): 从左到右第一次出现的下标
- arr.lastIndexOf(n): 从右到左第一次出现的下标
- arr.filter(): 过滤满足条件的数组
- arr.find()
- arr.findIndex()
- arr.includes()
- arr.map()
- arr.every()
- arr.some()
- arr.reduce()

## 深浅拷贝

JavaScript有两种数据类型，基础数据类型和引用数据类型。基础数据类型都是按值访问的，我们可以直接操作保存在变量中的实际的值。而引用类型如Array，我们不能直接操作对象的堆内存空间。引用类型的值都是按引用访问的，即保存在变量对象中的是一个地址，该地址与堆内存的实际值相关联

- 浅拷贝

  ```js
  const obj = { name: 'hyq' };
  let copy;
  Object.assign(copy， obj);
  ```

- 深拷贝

  ```js
  function deepCopy(newObj， oldObj) {
    for (const key in oldObj) {
        const item = oldObj[key];
        if (item instanceof Array) {
            newObj[key] = [];
            deepCopy(newObj[key]， item);
        } else if (item instanceof Object) {
            newObj[key] = {};
            deepCopy(newObj[key]， item);
        } else {
            newObj[key] = item;
        }
    }
  }
  ```

## diff 算法

diff 算法的核心是比对。虚拟DOM就是用来表示真实dom的对象，vue通过模版编译生成虚拟DOM树，然后在通过渲染器渲染成真实DOM，当数据更新时，产生新的虚拟dom树，如果直接用新的虚拟DOM树生成真实DOM并不是最优的方法。为了进一步降低找出差异的性能的性能消耗，就要使用diff算法。Diff算法是一种对比算法。对比两者是旧虚拟DOM和新虚拟DOM，对比出是哪个虚拟节点更改了，找出这个虚拟节点，并只更新这个虚拟节点所对应的真实节点，实现精准地更新真实DOM

### Vue2

vue2采用了双端diff算法。核心方法是 updateChildren ，通过新前与旧前、新后与旧后、新后与旧前、新前与旧后、暴力比对5种查找

- 新前：newChildren中所有未处理的第一个节点
- 新后：newChildren中所有未处理的最后一个节点
- 旧前：oldChildren中所有未处理的第一个节点
- 旧后：oldChildren中所有未处理的最后一个节点

### Vue3

vue3 使用了快速diff算法，核心方法是 patchKeyedChildren ，首先是借鉴了纯文本diff算法中的预处理思路，处理新旧两个组子节点中相同的前置节点和后置节点。处理完后，如果剩余节点无法简单的通过挂载新节点或者卸载已经不存在的节点来完成更新，则需要根据节点的索引关系，构建出一个最长递增子序列。最长递增子序列所指向的节点即为不需要移动的节点

## v-show 和 v-if 的区别

- v-if 有更高的切换开销，v-show 有更高的初始渲染开销
- v-if 适合运营条件不大可能改变；v-show 适合频繁切换
- v-if 通过动态向DOM树增删DOM元素，v-show 设置display来进行隐藏
- v-if 切换有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件；v-show 只是简单的基于 CSS 切换

## Vue 生命周期

1. setup: 可以使用 beforeCreate created
2. onBeforeMount
3. onMounted
4. onBeforeUpdate
5. onUpdated
6. onBeforeUnmount
7. onUnmounted
8. onActivated
9. onDeactivated
10. onErrorCaptured
11. onRenderTriggered
12. onRenderTracked

## 组件通信

- Props / 组件属性
- Custom Events / 自定义属性
- Event Bus / 事件总线
- VueX / 状态管理
- Provide & Inject / 依赖注入
- Ref & Reactive
- 全局事件
- useAttrs
- Pinia
- Slots / 插槽
- v-model / 双向绑定

## Pinia 和 VueX 的区别

- Pinia 它没有 mutation ，只有 state，使用 getters，action来修改 state 数据
- Pinia 默认也是存入内存中，如果需要使用本地存储，在配置上比 VueX 麻烦一点
- Pinia 语法上比 VueX 更容易理解和使用，灵活
- Pinia 没有 modules 配置，没一个独立的仓库都是 definStore 生成出来的
- Pinia 的 state 是一个对象，和组件的 data 是一样的语法

## Vue2 和 Vue3 的区别

- 生命周期
- 多根节点
- 组合式 API
- 异步组件
- Teleport
- 响应式原理
- 虚拟 DOM
- 事件缓存
- Diff 算法优化
- 打包优化
- TS 支持

## 虚拟 DOM

虚拟 DOM 这个概念相信大家都不陌生，简单地说，就是一个普通的 JavaScript 对象，包含了 tag、props、children 三个属性，以这三个属性来描述一个 DOM 节点，每组描述就是一个 VNode，整个 VNode 的集合就是一个虚拟 DOM 树

- 具备跨平台的优势
- 提升渲染性能
- 虚拟 DOM 的应用

## Get 和 Post 的区别

1. get 请求一般是去取获取数据（其实也可以提交，但常见的是获取数据）；post 请求一般是去提交数据
2. get 因为参数会放在 url 中，所以隐私性，安全性较差，请求的数据长度是有限制的，不同的浏览器和服务器不同，一般限制在 2~8K 之间，更加常见的是 1k 以内；post 请求是没有的长度限制，请求数据是放在 body 中
3. get 请求刷新服务器或者回退没有影响，post 请求回退时会重新提交数据请求
4. get 请求可以被缓存，post 请求不会被缓存
5. get 请求会被保存在浏览器历史记录当中，post 不会。get 请求可以被收藏为书签，因为参数就是 url 中，但 post 不能。它的参数不在 url 中
6. get 请求只能进行 url 编码（appliacation-x-www-form-urlencoded），post 请求支持多种（multipart/form-data等）

[可能是史上最全的权限系统设计](https://zhuanlan.zhihu.com/p/73414693)  
[ES6 有哪些新特性 ? 全网最详细](https://juejin.cn/post/7199962962630082618)  
[JS中的this指向问题(详细版)](https://blog.csdn.net/chen_junfeng/article/details/109235442)  
[数组常用的方法（17个）](https://blog.csdn.net/weixin_45753871/article/details/109525697)  
[JavaScript中浅拷贝和深拷贝的区别与实现](https://blog.csdn.net/icemwj/article/details/119782133)  
[说说 vue2 和 vue3 核心diff算法](https://juejin.cn/post/7092068900589797413#heading-14)  
[v-if和v-show的区别详解](https://blog.csdn.net/g1437353759/article/details/108676439)  
[pinia和vuex的区别、优缺点 何时使用Pinia，何时使用Vuex](https://juejin.cn/post/7198067983775760440)  
[盘点 Vue3 与 Vue2 的区别](https://juejin.cn/post/7067413380922867725)  
[Vue实现组件间通信的11种方式](https://zhuanlan.zhihu.com/p/640500427#:~:text=%E7%BB%84%E4%BB%B6%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1%E6%98%AF%E6%8C%87%E4%B8%8D%E5%90%8C%E7%BB%84%E4%BB%B6%E4%B9%8B%E9%97%B4%E5%9C%A8%E5%85%B1%E4%BA%AB%E6%95%B0%E6%8D%AE%E3%80%81%E4%BC%A0%E9%80%92%E6%B6%88%E6%81%AF%E6%88%96%E8%A7%A6%E5%8F%91%E4%BA%8B%E4%BB%B6%E7%AD%89%E6%96%B9%E9%9D%A2%E8%BF%9B%E8%A1%8C%E4%BA%A4%E6%B5%81%E5%92%8C%E5%8D%8F%E4%BD%9C%E7%9A%84%E8%BF%87%E7%A8%8B%E3%80%82,%E5%9C%A8%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F%E4%B8%AD%EF%BC%8C%E4%B8%8D%E5%90%8C%E7%9A%84%E7%BB%84%E4%BB%B6%E5%8F%AF%E8%83%BD%E9%9C%80%E8%A6%81%E7%9B%B8%E4%BA%92%E4%BC%A0%E9%80%92%E6%95%B0%E6%8D%AE%E3%80%81%E5%85%B1%E4%BA%AB%E7%8A%B6%E6%80%81%E3%80%81%E8%A7%A6%E5%8F%91%E5%8A%A8%E4%BD%9C%E6%88%96%E5%93%8D%E5%BA%94%E4%BA%8B%E4%BB%B6%E7%AD%89%EF%BC%8C%E4%BB%A5%E5%AE%9E%E7%8E%B0%E7%BB%84%E4%BB%B6%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8D%8F%E8%B0%83%E5%92%8C%E4%BA%A4%E4%BA%92%E3%80%82)  
[【vue3系列】vue3之生命周期(带图)](https://blog.csdn.net/qq_42445025/article/details/121978510)  
[JS基础系列之 —— 虚拟DOM](https://juejin.cn/post/7018009067733909518)  
[get请求和post请求的区别（全面讲解）](https://blog.csdn.net/qq_42931285/article/details/119852294)

```txt
新人发文，礼貌求关❤️
```
