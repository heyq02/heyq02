---
title: 每日前端面经 · 2024-03-12
date: 2024-03-12
---

# 【每日前端面经】2024-03-12

欢迎订阅我的前端面经专栏: [每日前端面经](https://blog.csdn.net/m0_66681776/category_12583217.html)

本期题目来源: [牛客](https://www.nowcoder.com/feed/main/detail/46ebf4f1ae3949009cc1e0930da52c54)

## 两个盒子，内盒子如何垂直水平居中

使用 flex 布局

```html
<div class="outer">
  <div class="inner"></div>
</div>

<style>
  .outer {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
```

## 给具有 target 属性的 a 标签设置样式

使用属性选择器

```html
<a target="__blank">hello</a>

<style>
  a[target='__blank'] {
    color: red;
  }
</style>
```

## em 和 rem 的区别

- em 相对于父元素的 font-size
- rem 相对于 html 根元素的 font-size

## 显示 6px 的字体

使用 `transform: scale(0.5)`

## 数组去重

- 使用 set

  ```js
  const initialArray = [1, 1, 2, 3, 4, 5, 5]
  const processedArray = Array.form(new Set(initialArray))
  ```

- 使用 filter

  ```js
  const processedArray = initialArray.filter((item, index) => {
    return initialArray.indexOf(item) === index
  })
  ```

- 使用 reduce

  ```js
  const processedArray = initialArray.reduce((prev, curr) => {
    return prev.includes(curr) ? prev : [...prev, curr]
  }, [])
  ```

- 使用 Map

  ```js
  const map = new Map()
  const processedArray = []
  for (const item of initialArray) {
    if (!map.has(item)) {
      map.set(item, true)
      processedArray.push(item)
    }
  }
  ```

## 数组原生方法

原型方法：

- Array.of: 创建数组
- Array.form: 创建数组

对象方法：

- join: 拼接数组
- push: 末尾添加元素
- pop: 末尾删除元素
- shift: 头部删除元素
- ubshift: 头部添加元素
- slice: 查找元素
- splice: 增删改元素
- fill: 填充元素
- filter: 过滤元素
- concat: 连接数组
- indexOf: 从左开始查询索引
- lastIndexOf: 从右开始查询索引
- every: 判断每一个是否满足条件
- some: 判断是否存在满足条件
- includes: 判断是否包含
- sort: 排序
- reverse: 倒序
- forEach: 遍历
- map: 遍历
- copyWithin: 拷贝
- find: 查询匹配条件的值
- findIndexOf: 查找匹配条件的值的索引
- toLocalString | toString: 转字符串
- flat | flatMap: 扁平化
- entries | keys | values: 遍历数组

## JS 数据类型

- Number
- String
- Boolean
- Null
- Undefined
- Object
- Symbol

## AJAX

全名 `async javascript and xml`，是前后台交互的能力

- 创建 AJAX 对象

  ```js
  const xhr = new XMLHttpRequest()
  ```

- 发起请求

  ```js
  xhr.open('get', '/data.php', true)
  xhr.send()
  ```

- 接收响应

  ```js
  xhr.onreadyStateChange = () => {
    if (xhr.readyState === 4) {
      console.log('成功返回象牙体：\n', xhr.reponseText)
    }
  }
  ```

## 拦截器的作用和使用场景

拦截器是一种动态拦截方法调用的机制，用于增强 API

- 在指定的方法前后调用预先设定的代码
- 阻止原生方法的执行

应用场景：

- 登录验证
- 权限验证
- 日志记录
- 处理 cookie
- 性能监控

## for-in 和 for-of

- 迭代对象的内容不同
  - for-in 是遍历键名
  - for-of 是遍历键值
- 迭代对象的类型不同
  - for-in 适合对象、数组、函数等
  - for-of 适合可迭代对象，如数组、字符串、Map、Set等
- 迭代对象的顺序不同
  - for-in 的顺序不确定
  - for-of 的顺序是确定的
- 迭代对象的原理不同
  - for-in 遍历对象的原型链
  - for-of 对可迭代对象进行枚举

## 参考资料

[22个超详细的 JS 数组方法](https://mp.weixin.qq.com/s?__biz=MjM5MDA2MTI1MA==&mid=2649106089&idx=1&sn=ebdcbc92fb957684ec10f6fb3c7b8167&chksm=be580104892f8812bc6f21f3b3a877c5f073814f5453f0e7a682a159b733ad76d1c05c9e8ceb&scene=27)  
[Ajax详解](https://blog.csdn.net/Zhang_wang_yun/article/details/130084505)  
[SpringMVC-2-Spring MVC拦截器详解：从入门到精通](https://zhuanlan.zhihu.com/p/651333083)  
[for in，for of区别](https://www.kuke99.com/zsb/877777533333598208.html)

```txt
新人发文，礼貌求关❤️
```
