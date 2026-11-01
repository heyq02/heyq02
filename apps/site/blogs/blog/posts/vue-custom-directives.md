---
title: Vue 自定义指令
description: 自定义指令的注册方式、钩子函数与参数，附 v-img 和 v-drag 两个示例。
date: 2023-02-25
---

# Vue 自定义指令

## 1. 基本介绍

除了使用内置的 Vue 指令，程序员还可以自定义 Vue 指令，从而☀️复用对 DOM 元素进行操作。使用方式便是 v-“指令名称”

## 2. 注册指令

注册自定义指令分为全局注册和局部注册，顾名思义，全局注册的指令注册在 main.js 内且**全局可用**，局部注册的指令注册在 Vue 组件里且**仅当前组件可用**

### 2.1 全局注册

- App.vue

```html
<template>
  <p v-global></p>
</template>

<script>
  export default {
    name: 'App'
  }
</script>
```

- main.js

```javascript
import { createApp } from 'vue'

import App from './App.vue'

const app = createApp(App)

app.directive('global', {
  mounted() {
    console.log('Global Hello')
  }
})

app.mount('#app')
```

### 2.2 局部注册

- TempTest.vue

```html
<template>
  <p v-local></p>
</template>

<script>
  export default {
    name: 'TempTest',
    directives: {
      local: {
        mounted() {
          console.log('Local Hello')
        }
      }
    }
  }
</script>
```

## 3. 钩子函数及其参数

### 3.1 钩子函数

自定义指令主要是为了**重用**涉及普通元素的底层 DOM 访问的逻辑。一个自定义指令由一个包含类似组件生命周期钩子📎的对象来定义。钩子函数会接收到指令所绑定元素作为其参数

```javascript
myDirective: {

  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created() {},

  // 在元素被插入到 DOM 前调用
  beforeMount() {},

  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted() {},

  // 绑定元素的父组件更新前调用
  beforeUpdate() {},

  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated() {},

  // 绑定元素的父组件卸载前调用
  beforeUnmount() {},

  // 绑定元素的父组件卸载后调用
  unmounted() {}
}
```

### 3.2 参数

- el：
  指令绑定到的元素。这可以用于直接操作 DOM。
- binding：
  一个对象，包含以下属性。
  - value：传递给指令的值。例如在 v-my-directive=“1 + 1” 中，值是 2。
  - oldValue：之前的值，仅在 beforeUpdate 和 updated 中可用。无论值是否更改，它都可用。
  - arg：传递给指令的参数 (如果有的话)。例如在 v-my-directive:foo 中，参数是 “foo”。
  - modifiers：一个包含修饰符的对象 (如果有的话)。例如在 v-my-directive.foo.bar 中，修饰符对象是 `{ foo: true, bar: true }`。
  - instance：使用该指令的组件实例。
  - dir：指令的定义对象。
- vnode：
  代表绑定元素的底层 VNode。
- prevNode：
  之前的渲染中代表指令所绑定元素的 VNode。仅在 beforeUpdate 和 updated 钩子中可用。

```html
<template>
  <div v-test:ARG.a.b="'VALUE'">
    <h2>测试自定义指令的参数</h2>
  </div>
</template>

<script>
  export default {
    name: 'TempTest',
    directives: {
      test: {
        mounted(el, binging, vnode) {
          console.log(el.innerText)
          console.log(el.innerHTML)
          // 测试自定义指令的参数
          // <h2>测试自定义指令的参数</h2>

          console.log(binging.value)
          console.log(binging.arg)
          console.log(binging.modifiers)
          // VALUE
          // ARG
          // {a: true, b: true}

          console.log(vnode)
          // { __v_isVNode: true, __v_skip: true, type: "div", props: null}
        }
      }
    }
  }
</script>
```

在动态值、动态参数、修饰符中可以**动态绑定**的唯有前两种

```html
<template>
  <div v-test:[num].a.b="num"></div>
</template>

<script>
  export default {
    name: 'TempTest',
    data() {
      return {
        num: 11
      }
    },
    directives: {
      test: {
        mounted(el, binding) {
          console.log(el, binding)
        }
      }
    }
  }
</script>
```

对于自定义指令来说，一个很常见的情况是仅仅需要在 mounted 和 updated 上实现相同的行为，除此之外并不需要其他钩子。这种情况下我们可以直接用一个函数来定义指令

```javascript
app.directive('color', (el, binding) => {
  // 这会在 `mounted` 和 `updated` 时都调用
  el.style.color = binding.value
})
```

## 4. 自定义指令范例

### 4.1 `v-img` 指令

当页面加载一个很大的图片时，在未成功加载之前，会在图片位置出现空白区域。v-img 指令会在未加载图片之前，在图片位置显示随机的颜色

```html
<div v-img="'image/logo.gif'"></div>
```

```javascript
img: {
      mounted(el, binding) {
        const color = Math.floor(Math.random()*1000000);
        el.style.backgroundColor = `#${color}`;

        const img = new Image();
        img.src = binding.value;
        img.onload = () => {
          el.style.backgroundImage = `url(${binding.value})`;
        }
      }
    }
```

### 4.2 `v-drag` 指令

v-drag 支持用鼠标拖拽网页上特定的 DOM 元素移动

```html
<div v-drag></div>
```

```javascript
drag(el) {
      el.onmousedown = (event) => {

        // 获取单点处分别与 div 左边和上边的距离，
        // 取值为鼠标位置减去 div 位置
        const disX = event.clientX - el.offsetLeft;
        const disY = event.clientY - el.offsetTop;
        console.log(disX, disY);

        // 处理在整个网页区域中移动鼠标的事件
        document.onmousemove = (event) => {
          // 获取移动后的 div 的位置，
          // 取值为鼠标位置减去 disX，disY
          const left = event.clientX - disX;
          const top = event.clientY - disY;
          // 重新设置 DOM 元素的位置
          el.style.left = left + 'px';
          el.style.top = top + 'px';
        }

        // 处理整个网页中鼠标弹起和停止移动鼠标的事件
        document.onmouseup = (event) => {
          document.onmousemove = null;
          document.onmouseup = null;
        }
      }
    }
```

参考资料：

- https://cn.vuejs.org/
- 《精通Vue.js Web前端开发技术详解》

> 原文：[Vue---自定义指令](https://blog.csdn.net/m0_66681776/article/details/128676476?spm=1011.2415.3001.5331) · 作者 m0_66681776
