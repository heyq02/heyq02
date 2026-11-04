---
title: Mock.js 源码分析（一）：Util.extend
description: 逐行拆解 Mock.js 的 Util.extend：初始化、迭代条件、迭代体与返回值，并用示例验证拷贝行为。
date: 2023-02-28
---

# Mock.js 源码分析（一）：Util.extend

Mock 是一个前端常用的接口模拟器。本专栏是对 mockjs 源码进行细致的分析。

本次的内容是 Util 工具类的 extend 函数，通过迭代 + 深拷贝的方式增强构造函数。

GitHub：https://github.com/nuysoft/Mock

## 作用分析

util.extend 存在于 /src/mock/util.js，接收 >= 两个参数，分别为待增强对象和增强对象s

```javascript
// 构造函数
function ext() {
  this.name = {
    na: '123'
  }
}
// ext实例
var te = new ext()

console.log(te)
// ext { name: { na: '123' } }

// 增强对象
var high = { cd: 1, ag: 2 }

// 增强构造函数
Util.extend(te, high)

console.log(te)
// ext { name: { na: '123' }, cd: 1, ag: 2 }
```

## 源码分析

### 2.1 初始化部分

```javascript
var target = arguments[0] || {},
  i = 1,
  length = arguments.length,
  // options, name, src, copy, clone
  options,
  name,
  src,
  copy
```

- target存储的是待增强对象
- i暂存1，表示第一个增强对象
- length表示参数数量
- options、name、src、copy占位

### 2.2 迭代条件

```javascript
if (length === 1) {
  target = this
  i = 0
}
```

当迭代到最后，参数中只剩下了需增强对象，而增强对象已经迭代完毕，则将target指向this，配合for条件终止迭代，逆向进行增强

### 2.3 迭代体

```javascript
for (; i < length; i++) {
  options = arguments[i]
  if (!options) continue

  for (name in options) {
    src = target[name]
    copy = options[name]

    if (target === copy) continue
    if (copy === undefined) continue

    if (Util.isArray(copy) || Util.isObject(copy)) {
      if (Util.isArray(copy)) clone = src && Util.isArray(src) ? src : []
      if (Util.isObject(copy)) clone = src && Util.isObject(src) ? src : {}

      target[name] = Util.extend(clone, copy)
    } else {
      target[name] = copy
    }
  }
}
```

- i控制options依次取得增强对象
- name遍历增强options的键
- src存储源对象的键值
- copy存储增强对象的键值
- 判断copy是否为对象/数组，是否需要迭代
- 不需要迭代的话，则将target[name]设置为copy，完成对象增强

### 2.4 返回值

```javascript
return target
```

直接返回target即可

## 实战案例

```javascript
const Util = {}

/**
 * 判断是否为数组
 * @param obj
 * @returns {boolean}
 */
Util.isArray = obj => {
  return obj instanceof Array ? true : false
}

/**
 * 判断是否为对象
 * @param obj
 * @returns {boolean}
 */
Util.isObject = obj => {
  return obj instanceof Object ? true : false
}

/**
 * 增强构造函数
 * @returns {any|{}}
 */
Util.extend = function () {
  let target = arguments[0] || {},
    i = 1
  const length = arguments.length
  let options, name, src, copy, clone

  if (length === 1) {
    target = this
    i = 0
  }

  for (; i < length; i++) {
    options = arguments[i]

    if (!options) continue

    for (name in options) {
      src = target[name]
      copy = options[name]

      if (target === copy) continue
      if (copy === undefined) continue

      if (Util.isArray(copy) || Util.isObject(copy)) {
        if (Util.isArray(copy)) clone = src && Util.isArray(src) ? src : []
        if (Util.isObject(copy)) clone = src && Util.isObject(src) ? src : {}

        target[name] = Util.extend(clone, copy)
      } else {
        target[name] = copy
      }
    }
  }

  return target
}
```

```javascript
// 初始化构造函数
function Test() {
  this.info = {
    name: 'hh',
    age: 18
  }
}

console.log(Test)

// 增强对象1
const enhance1 = {
  nig: 'kk',
  kids: ['z3', 'l4']
}

// 增强对象2
const enhance2 = {
  nig2: 'kk',
  kids2: ['z3', 'l4']
}

// 增强构造函数
Util.extend(Test, enhance1, enhance2)

console.log(Test)
```

第一次的输出为：

```javascript
[Function: Test]
```

第二次的输出为：

```javascript
[Function: Test] {
  nig: 'kk',
  kids: { '0': 'z3', '1': 'l4' },
  nig2: 'kk',
  kids2: { '0': 'z3', '1': 'l4' }
}
```

成功增强了构造函数Test
