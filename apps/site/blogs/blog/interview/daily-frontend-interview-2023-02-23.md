---
title: 每日前端面经 · 2023-02-23
date: 2023-02-23
---

题目来源: [牛客](https://www.nowcoder.com/feed/main/detail/76d776afaa7b4e99bce687daedcfa046?sourceSSR=users)

# 企业级开发整体流程有哪些

1. 项目启动
2. 需求调研->需求文档
3. 系统设计->设计文档
4. 程序开发->开发文档
5. BUG测试->测试文档
6. 验收
7. 维护

# 遇到技术难题怎么办

1. 分析可能出现的原因
2. 查找搜索引擎
3. 寻问文心一言等对话模型
4. 打断点，寻找问题复现
5. 再一次归纳分析
6. 询问师傅或更高级的工程师

# 常用的设计模式

- 工厂模式
  - 简单工厂模式
  - 抽象工厂模式
- 单例模式
  - 懒汉单例
  - 饿汉单例
- 装饰器模式
- 策略模式
- 代理模式
- 观察者模式
- 发布订阅模式

# 单例模式具体实现和原理

单例模式涉及单一的类，该类负责创建自己的对象，同时确保只有单个对象被创建

```ts
// 懒汉单例
class LazySingleInstance {
    private constructor {}

    private static instance: LazySingleInstance;
    static getInstance() {
        if (!LazySingleInstance.instance) {
            return LazySingleInstance.instance;
        }
        LazySingleInstance.instance = new LazySingleInstance();
        return LazySingleInstance.instance;
    }
}

// 饿汉单例
class HungrySingleInstance {
    private constructor {}

    private static instance = new HungrySingleInstance();
    static getInstance() {
        return HungrySingleInstance.instance;
    }
}
```

# 发布订阅模式如何实现

```js
class Event {
    constructor() { this.events = {} }

    // 订阅
    on(type, callback) {
        if (this.events[type] === undefined) this.events[type] = [];
        this.events[type].push({ listener: callback });
    }

    // 发布
    emit(type. args) {
        this.events[type].forEach(ele => {
            ele.listener(args)
        });
    }
}
```

# 发布订阅模式存在的风险

最大的缺点是松耦合，需要中间的代理，增加了系统的复杂度

# TS泛型

泛型的特点就是带有“类型参数”

```ts
function getFirst<T>(arr: T[]): T {
  return arr[0]
}
```

# 什么情况用枚举类型

用于组合一系列常量从而实现共享复用

# interface递归结构如何处理

interface可以在结构定义中引用interface定义的接口

# 典型ES6新特性

- 展开运算符
- 剩余参数
- 字符串插值
- 属性简写
- 对象方法简写
- 解构赋值
- 数组新方法
- Promise
- 模块化

# async await和promise什么情况下用哪种

async/await适用于异步请求相互独立的情况  
Promise适用于同时进行多个异步请求的情况

# promise.all其中一个接口挂了有什么后果

如果有一个接口挂了，那么会立刻将其reject掉，不再等待其他异步操作执行

# async await接口挂了怎么处理

会直接抛出错误，可以用try/catch捕获

# promise对象的本质

Promise是一个对象，代表了一个异步操作的最终完成或者失败，本质上Promise是一个函数返回的对象，可以在上面绑定回调函数，就不需要一开始把回调函数作为参数传入

# promise对象里面做了什么事

# promise封装AJAX怎么用

```js
const ajax = url => {
  return new Promise((resolve, reject) => {
    const req = new XHLHttpRequest()
    req.open('GET', url, true)
    req.onload = () =>
      req.status === 200 ? resolve(req.responseText) : reject(new Error(req.statusText))
    request.onerror = () => reject(new Error(req.statusText))
    request.send()
  })
}

const url = '/ajax/get'
ajax(url)
  .then(value => console.log(value))
  .catch(error => console.log(error))
```

# 构造函数、实例、原型三者关系

每一个构造函数有一个prototype指向其原型对象  
每一个原型对象有一个constructor指向其构造函数  
每一个实例对象有一个__proto__指向其原型对象

# 字符串的constructor是什么

字符串的构造函数是String。当String作为构造函数使用时，会创建一个String对象而非原始数据类型；而被作为函数调用时，会将参数强制转换成一个字符串原始类型

# 类的私有成员和共享成员

- public: 默认值，没有访问限制
- protected: 只允许在类的内部以及直接子类中访问
- private: 只允许在类的内部访问
- static: 静态变量，与实例无关

# 用面对对象思想抽象组件

# bind、apply和call的区别

call和apply的区别在于apply的传参使用的是数组  
call和bind的区别在于bind不会离开调用函数

# 数组操作方法里比较方便匹配是什么API

Array.find

# 遍历数组里面返回新的数据结构

- for
- while
- for-in
- for-of
- forEach
- map

# 什么情况下用==不用===

绝大多数场合可以直接使用===，只有检测是否为null/undefined时可以使用==

# 数据类型判断

- 基本数据类型：typeof
- 通过对象类型判断: instance of
- 根据原型链判断: prototype
- 根据构造器判断: constructor

# 为什么Object.prototype.toString().call(obj)需要用call，apply可以么

# set和map生成的数据怎么转数组

使用Array.from即可

# webpack怎么处理各种loader和plugin以及webpack的生命周期

loader就是一个函数，接受原始资源作为参数，输出进行转换后的内容  
plugin会在webpack生命周期中监听事件，并在合适的时机改变输出结果

- beforeRun: 读取配置之前
- run: 开始编译
- watchRun
- beforeCompile: 使用webpack-dev-server时会调用
- compile: 开始编译时
- thisCompilation: 创建新的Compilation对象时
- compilation: 生成新的Compilation对象时
- emit: 生成资源之前
- afterEmit: 生成资源之后
- done: 编译完成时
- assetEmitted: 所有资源打包完毕后

# 介绍广度优先遍历和深度优先遍历的特性和区别

## 广度优先遍历

特点是回放。

1. 从图中某顶点v出发，在访问了v之后依次访问v的各个未访问的邻接点
2. 然后分别从这些邻接点出发依次访问它们的邻接点，并使得先被访问的顶点的邻接点先于后被访问的顶点的邻接点，直到图中所有已被访问顶点的邻接点都被访问到
3. 如果此时图中尚有顶点渭北访问，则需要另选一个未曾被访问过的顶点作为新的起始点，重复上述过程，直到图中所有顶点都被访问到为止

## 深度优先遍历

特点在于回溯

1. 假设初始状态是图中所有顶点均未被访问
2. 从某个顶点触发，然后一次从它的各个未被访问的临界点出发深度优先搜索遍历图，直至图中所有和初始点有路径相通的顶点都被访问到
   3 若此时尚有未被访问到的顶点，那么则另选一个未被访问的初始点作为起点，重复上述过程

[算法：深度优先遍历和广度优先遍历](https://blog.csdn.net/zhizhengguan/article/details/122468043)
[企业的软件项目开发你一定要知道的那些流程！](https://zhuanlan.zhihu.com/p/351273591#:~:text=%E4%BC%81%E4%B8%9A%E7%9A%84%E8%BD%AF%E4%BB%B6%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E4%BD%A0%E4%B8%80%E5%AE%9A%E8%A6%81%E7%9F%A5%E9%81%93%E7%9A%84%E9%82%A3%E4%BA%9B%E6%B5%81%E7%A8%8B%EF%BC%81%201%201%E3%80%81%E9%A1%B9%E7%9B%AE%E5%90%AF%E5%8A%A8%201%29%E3%80%81%E9%A1%B9%E7%9B%AE%E7%BB%84%E6%88%90%E7%AB%8B%20%28%E5%85%AC%E5%8F%B8%E6%88%90%E5%91%98%E3%80%81%E5%AE%A2%E6%88%B7%E6%88%90%E5%91%98%29%202%29%E3%80%81%E5%88%B6%E5%AE%9A%E9%A1%B9%E7%9B%AE%E9%A2%84%E6%9C%9F%E7%9B%AE%E6%A0%87%203%29%E3%80%81%E5%88%B6%E5%AE%9A%E9%A1%B9%E7%9B%AE%E8%AE%A1%E5%88%92%E5%91%A8%E6%9C%9F%20...,1%29%E3%80%81%E7%BC%96%E5%86%99%E6%B5%8B%E8%AF%95%E8%AE%A1%E5%88%92%E5%92%8C%E6%B5%8B%E8%AF%95%E6%96%B9%E6%A1%88%202%29%E3%80%81%E5%8A%9F%E8%83%BD%E6%B5%8B%E8%AF%95%20...%206%206%E3%80%81%E8%AF%95%E7%94%A8%E3%80%81%E5%9F%B9%E8%AE%AD%E3%80%81%E7%BB%B4%E6%8A%A4%20%E6%9C%AC%E9%98%B6%E6%AE%B5%E9%9C%80%E8%A6%81%E8%A7%A3%E5%86%B3%EF%BC%9A%201%29%E3%80%81%E8%A7%A3%E5%86%B3%E5%BC%82%E5%9C%B0%E4%BF%AE%E6%94%B9%E5%92%8C%E5%85%AC%E5%8F%B8%E4%BF%AE%E6%94%B9%E7%9A%84%E5%90%8C%E6%AD%A5%E9%97%AE%E9%A2%98%E3%80%82%20)
[程序员遇到技术问题该怎么解](https://blog.csdn.net/renlonggg/article/details/72528517#:~:text=%E9%81%87%E5%88%B0%E9%97%AE%E9%A2%98%E9%A6%96%E5%85%88%E5%B0%B1%E5%BE%97%E8%80%83%E8%99%91%E8%87%AA%E5%B7%B1%E8%A7%A3%E5%86%B3%EF%BC%8C%E4%B8%8D%E8%A6%81%E6%9C%89%E4%BE%9D%E8%B5%96%E5%88%AB%E4%BA%BA%E8%A7%A3%E5%86%B3%E7%9A%84%E5%88%9D%E8%A1%B7%E3%80%82%203%EF%BC%8C%E8%87%AA%E5%B7%B1%E5%AE%9E%E5%9C%A8%E6%90%9E%E4%B8%8D%E5%AE%9A%EF%BC%8C%E5%86%8D%E5%8E%BB%E8%AF%B7%E6%95%99%E5%90%8C%E4%BA%8B%E6%88%96%E8%80%85%E4%B8%8A%E4%B8%80%E7%BA%A7%E6%8A%80%E6%9C%AF%E8%B4%9F%E8%B4%A3%E4%BA%BA%EF%BC%9B%E4%B8%8D%E8%83%BD%E4%B8%BA%E4%BA%86,%E9%9D%A2%E5%AD%90%E4%B8%80%E7%9B%B4%E9%99%B7%E5%9C%A8%E9%82%A3%E4%B8%AA%E5%9D%91%E9%87%8C%E3%80%82%20%E6%88%96%E8%80%85%E5%85%88%E5%81%9A%E5%85%B6%E4%BB%96%E6%89%8B%E4%B8%8A%E7%9A%84%E5%B7%A5%E4%BD%9C%EF%BC%8C%E8%AE%A9%E8%84%91%E5%AD%90%E5%9C%A8%E8%BF%99%E4%B8%AA%E9%97%AE%E9%A2%98%E4%B8%8A%E4%BC%91%E6%81%AF%E4%B8%80%E4%B8%8B%EF%BC%8C%E4%B9%9F%E8%AE%B8%E8%BF%87%E5%87%A0%E5%A4%A9%E8%A7%A3%E5%86%B3%E7%9A%84%E6%80%9D%E8%B7%AF%E5%B0%B1%E5%87%BA%E6%9D%A5%E4%BA%86%E3%80%82)
[如何理解这6种常见设计模式？](https://zhuanlan.zhihu.com/p/231526884)
[菜鸟教程](https://www.runoob.com/)
[如何使用js来实现一个发布订阅模式](https://blog.csdn.net/lucky569/article/details/118542497)
[设计模式之发布订阅模式—— 一文搞懂发布订阅模式](https://zhuanlan.zhihu.com/p/182546537#:~:text=%E5%BD%93%E7%84%B6%E8%BF%99%E7%A7%8D%E6%9D%BE%E8%80%A6%E5%90%88%E4%B9%9F%E6%98%AF%20%E5%8F%91%E5%B8%83%2F%E8%AE%A2%E9%98%85%E8%80%85%E6%A8%A1%E5%BC%8F,%E6%9C%80%E5%A4%A7%E7%9A%84%E7%BC%BA%E7%82%B9%EF%BC%8C%E5%9B%A0%E4%B8%BA%E9%9C%80%E8%A6%81%E4%B8%AD%E9%97%B4%E7%9A%84%E4%BB%A3%E7%90%86%EF%BC%8C%E5%A2%9E%E5%8A%A0%E4%BA%86%E7%B3%BB%E7%BB%9F%E7%9A%84%E5%A4%8D%E6%9D%82%E5%BA%A6%E3%80%82%20%E8%80%8C%E4%B8%94%E5%8F%91%E5%B8%83%E8%80%85%E6%97%A0%E6%B3%95%E5%AE%9E%E6%97%B6%E7%9F%A5%E9%81%93%E5%8F%91%E5%B8%83%E7%9A%84%E6%B6%88%E6%81%AF%E6%98%AF%E5%90%A6%E8%A2%AB%E6%AF%8F%E4%B8%AA%E8%AE%A2%E9%98%85%E8%80%85%E6%8E%A5%E6%94%B6%E5%88%B0%E4%BA%86%EF%BC%8C%E5%A2%9E%E5%8A%A0%E4%BA%86%E7%B3%BB%E7%BB%9F%E7%9A%84%E4%B8%8D%E7%A1%AE%E5%AE%9A%E6%80%A7%E3%80%82)
[阮一峰TypeScripe教程](https://typescript.p6p.net/)
[TypeScript字符串枚举，以及何时和如何使用它们](https://juejin.cn/post/7070533903152316424)
[9个常用ES6特性归纳(一般用这些就够了)](https://zhuanlan.zhihu.com/p/179966620#:~:text=9%E4%B8%AA%E5%B8%B8%E7%94%A8ES6%E7%89%B9%E6%80%A7%E5%BD%92%E7%BA%B3%20%28%E4%B8%80%E8%88%AC%E7%94%A8%E8%BF%99%E4%BA%9B%E5%B0%B1%E5%A4%9F%E4%BA%86%29%201%201%E3%80%81%E5%B1%95%E5%BC%80%E6%93%8D%E4%BD%9C%E7%AC%A6%20%E9%A1%BE%E5%90%8D%E6%80%9D%E4%B9%89%EF%BC%8C%E7%94%A8%E4%BA%8E%E5%AF%B9%E8%B1%A1%E6%88%96%E6%95%B0%E7%BB%84%E4%B9%8B%E5%89%8D%E7%9A%84%E5%B1%95%E5%BC%80%E6%93%8D%E4%BD%9C%E7%AC%A6%EF%BC%88%E2%80%A6%EF%BC%89%EF%BC%8C%E5%B0%86%E4%B8%80%E4%B8%AA%E7%BB%93%E6%9E%84%E5%B1%95%E5%BC%80%E4%B8%BA%E5%88%97%E8%A1%A8%E3%80%82%20%E6%BC%94%E7%A4%BA%E4%B8%80%E4%B8%8B%EF%BC%9A%20let%20firstHalf,7%E3%80%81%E6%95%B0%E7%BB%84%E6%96%B9%E6%B3%95%20ES6%20%E5%BC%95%E5%85%A5%E4%BA%86%E8%AE%B8%E5%A4%9A%E6%9C%89%E7%94%A8%E7%9A%84%E6%95%B0%E7%BB%84%E6%96%B9%E6%B3%95%EF%BC%8C%E4%BE%8B%E5%A6%82%EF%BC%9A%20...%208%208%E3%80%81%E5%BC%82%E6%AD%A5%E6%96%B9%E6%A1%88%20%E5%A6%82%E6%9E%9C%E4%BD%A0%E5%9C%A8%E8%BF%99%E4%B8%AA%E5%9C%88%E5%AD%90%E9%87%8C%E5%91%86%E4%BA%86%E4%BA%9B%E5%B9%B4%E5%A4%B4%EF%BC%8C%E4%B9%9F%E8%AE%B8%E4%BC%9A%E8%AE%B0%E5%BE%97%E6%9B%BE%E7%BB%8F%E6%9C%89%E4%B8%80%E4%B8%AA%E6%97%B6%E6%9C%9F%E6%88%91%E4%BB%AC%E5%8F%AA%E6%9C%89%E5%9B%9E%E8%B0%83%E5%B0%B1%E5%83%8F%E8%BF%99%E6%A0%B7%EF%BC%9A%20)
[Promise和async/await的两种常用的实际应用场景](https://blog.csdn.net/qq_41644739/article/details/102800362)
[async,await做错误处理，每请求一个接口都要try,catch一下吗?](https://www.zhihu.com/question/428636078/answer/1560986725)
[JavaScript——promise(一）基础篇](https://blog.csdn.net/Rice_w/article/details/127162932#:~:text=%E4%BB%80%E4%B9%88%E6%98%AFpromise%E5%91%A2%EF%BC%9F%20MDN%E4%B8%8A%E6%98%AF%E8%BF%99%E6%A0%B7%E8%A7%A3%E9%87%8A%E7%9A%84%EF%BC%9A,Promise%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AF%B9%E8%B1%A1%EF%BC%8C%E4%BB%96%E4%BB%A3%E8%A1%A8%E4%BA%86%E4%B8%80%E4%B8%AA%E5%BC%82%E6%AD%A5%E6%93%8D%E4%BD%9C%E7%9A%84%E6%9C%80%E7%BB%88%E5%AE%8C%E6%88%90%E6%88%96%E8%80%85%E5%A4%B1%E8%B4%A5%E3%80%82%20%E6%9C%AC%E8%B4%A8%E4%B8%8APromise%E6%98%AF%E4%B8%80%E4%B8%AA%E5%87%BD%E6%95%B0%E8%BF%94%E5%9B%9E%E7%9A%84%E5%AF%B9%E8%B1%A1%EF%BC%8C%E6%88%91%E4%BB%AC%E5%8F%AF%E4%BB%A5%E5%9C%A8%E5%AE%83%E4%B8%8A%E9%9D%A2%E7%BB%91%E5%AE%9A%E5%9B%9E%E8%B0%83%E5%87%BD%E6%95%B0%EF%BC%8C%E8%BF%99%E6%A0%B7%E6%88%91%E4%BB%AC%E5%B0%B1%E4%B8%8D%E9%9C%80%E8%A6%81%E4%B8%80%E5%BC%80%E5%A7%8B%E6%8A%8A%E5%9B%9E%E8%B0%83%E5%87%BD%E6%95%B0%E4%BD%9C%E4%B8%BA%E5%8F%82%E6%95%B0%E4%BC%A0%E5%85%A5%E8%BF%99%E4%B8%AA%E5%87%BD%E6%95%B0%E4%BA%86)
[5分钟带你搞懂 构造函数、原型对象、实例对象、原型、原型链](https://blog.csdn.net/qq_52902590/article/details/132078639)
[MDN官方文档](https://developer.mozilla.org/zh-CN/)
[ts class中的成员可见性（public,protected,private,static）](https://juejin.cn/post/7182910044424372282)
[手写Webpack生命周期及其实现过程](https://juejin.cn/post/7206487695123480635)
[彻底掌握 Webpack 中 Loader 和 Plugin 的机制](https://juejin.cn/post/7068216285724672008)
[js判断数据类型常用的6种方法](https://blog.csdn.net/Clara_G/article/details/104755965)
[](https://zhuanlan.zhihu.com/p/112006700)

```
新手发文，礼貌求关❤️
```
