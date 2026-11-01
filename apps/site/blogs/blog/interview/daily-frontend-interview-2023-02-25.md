---
title: 每日前端面经 · 2023-02-25
date: 2023-02-25
---

题目来源: [牛客](https://www.nowcoder.com/discuss/509810579117215744)+[牛客](https://www.nowcoder.com/users/37902934)

# 每日面经20240225

## 了解Taro么

Taro是一个开放式跨端跨框架解决方案，支持使用React/Vue/Nerv等框架来开发微信/京东/百度/支付宝/字节跳动/QQ/飞书 小程序/H5/RN等应用

## 多端适配怎么做

- 固定布局（PC）
- window.screen分类加载CSS
- @media媒体查询
- vh+vw+rem
- 百分比布局
- 响应式布局

## 移动端适配怎么做

同上

## 偏工程化如何做字体大小的适配

通过媒体查询用vw设置字体大小

## TS高级类型

- Pequired: 将全部属性置为必填
- Partial: 将全部属性置为可选
- Readonly: 将全部属性改为只读
- Record: 以typeof格式快速创建全部属性为必填项的类型
  ```ts
  type Coord = Record<'x' | 'y', number>

  // 等效于
  type Coord = {
    x: number
    y: number
  }
  ```
- Pick: 从类型定义的属性中选取一组属性，返回一个新的类型定义
  ```ts
  type Coord = Record<'x' | 'y'. number>;
  type CoordX = Pick<Coord, 'x'>;

  // 等效于
  type _CoordX = {
      x: number
  }
  ```

## 实现深拷贝

- 基本数据类型是否能拷贝
- 键值都是基本数据类型的普通对象是否能拷贝
- Symbol作为对象的键的对象是否能拷贝
- Date和RegExp对象是否能拷贝
- Map和Set对象是否能拷贝
- Function对象是否能拷贝
- 对象的原型是否能拷贝
- 不可枚举属性是否能拷贝
- 循环引用是否能拷贝

```js
function deepClone(target) {
    const map = new WeakMap();

    const isObject = (target) => (typeof target === 'object' && target) || typeof target === 'function';

    function clone(data) {
        if (!isObject(data)) return data;
        if ([Date, RegExp].includes(data.constructor)) return new data.constructor(data);
        if (typeof data === 'function') return new Function('return ' + data.toString())()
        if map.get(data) return map.get(data);
        if (data instanceof Map) {
            const result = new Map();
            map.set(data, result);
            data.forEach((value, key) => {
                if (isObject(value)) {
                    result.set(key, clone(val));
                } else {
                    result.set(key, value);
                }
            });
            return result;
        }
        if (data instanceof Set) {
            const result = new Set();
            map.set(data, result);
            data.forEach((value) => {
                if (isObject(value)) {
                    result.add(clone(value));
                } else {
                    result.add(value);
                }
            });
            return result;
        }
        const keys = Reflect.ownKeys(data);
        const allDesc = Object.getOwnPropertyDescriptors(data);
        const result = Object.create(Object.getPrototypeof(data), allDesc);
        map.set(data, result);
        kets.forEach((key) => {
            const value = data[key];
            if (isObject(value)) {
                result[key] = clone(value);
            } else {
                result[key] = value;
            }
        });
        return result;
    }
}
```

## 创建单链表并判断是否成环

```js
function ListNode(value) {
  this.value = value
  this.next = null
}

/**
 * @param {ListNode} head
 * @return {boolean}
 */
function hasCycle(head) {
  if (head === null || head.next === null) return false
  const slow = head
  const fast = head.next
  while (slow && fast) {
    if (slow === fast) return true
    slow = slow.next
    fast = fast.next ? fast.next.next : null
  }
  return false
}
```

[JavaScript深拷贝看这篇就行了！（实现完美的ES6+版本）](https://blog.csdn.net/cc18868876837/article/details/114918262)  
[js算法：如何判断一个链表有环](https://juejin.cn/post/7029491579983233061)  
[Typescript 中的 Partial, Readonly, Record, Pick](https://juejin.cn/post/6844904066489778183)  
[Taro官方文档](https://taro.redwoodjs.cn/docs/README)  
[如何解决多端适配](https://juejin.cn/post/7090049820592701448)

```
新手发文，礼貌求关❤️
```
