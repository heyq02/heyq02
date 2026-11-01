---
title: 每日前端面经 · 2024-03-10
date: 2024-03-10
---

# 【每日前端面经】2024-03-10

欢迎订阅我的前端面经专栏: [每日前端面经](https://blog.csdn.net/m0_66681776/category_12583217.html)

本期题目来源: [牛客](https://www.nowcoder.com/feed/main/detail/dd0db4a8e0664530ba1666e01aad71ea)

## 回流与重绘

- 重绘：当一个元素的外观发生改变，但没有改变布局,重新把元素外观绘制出来的过程，叫做重绘

- 回流：当DOM的变化影响了元素的几何信息(元素的的位置和尺寸大小)，浏览器需要重新计算元素的几何属性，将其安放在界面中的正确位置
  - 页面初始渲染，这是开销最大的一次回流
  - 添加/删除可见的 DOM 元素
  - 改变元素位置
  - 改变元素尺寸，比如边距、填充、边框、宽度和高度等
  - 改变元素内容，比如文字数量，图片大小等
  - 改变元素字体大小
  - 改变浏览器窗口尺寸，比如 resize 事件发生时
  - 激活 CSS 伪类（例如：:hover）
  - 设置 style 属性的值，因为通过设置 style 属性改变结点样式的话，每一次设置都会触发一次 reflow
  - 查询某些属性或调用某些计算方法：offsetWidth、offsetHeight等，除此之外，当我们调用 getComputedStyle 方法，或者IE里的 currentStyle 时，也会触发回流，原理是一样的，都为求一个即时性和准确性

## 如何避免回流

### 减少范围

- 尽可能在低层级的DOM节点上，而不是像上述全局范围的示例代码一样，如果你要改变p的样式，class就不要加在div上，通过父元素去影响子元素不好
- 不要使用 table 布局，可能很小的一个小改动会造成整个 table 的重新布局。那么在不得已使用table的场合，可以设置table-layout:auto;或者是table-layout:fixed这样可以让table一行一行的渲染，这种做法也是为了限制reflow的影响范围

### 减少次数

- 样式集中改变: 不要频繁的操作样式，对于一个静态页面来说，明智且可维护的做法是更改类名而不是修改样式，对于动态改变的样式来说，相较每次微小修改都直接触及元素，更好的办法是统一在 cssText 变量中编辑。虽然现在大部分现代浏览器都会有 Flush 队列进行渲染队列优化，但是有些老版本的浏览器比如IE6的效率依然低下
- 分离读写操作：DOM 的多个读操作（或多个写操作），应该放在一起。不要两个读操作之间，加入一个写操作
- 将 DOM 离线
  - 使用 display: none
  - 通过 documentFragment 创建文档碎片在添加进文档中
  - 复制节点 -> 操作副本 -> 替换
- 使用 absolute / fixed 脱离文档流：使用绝对定位会使的该元素单独成为渲染树中 body 的一个子元素，回流开销比较小，不会对其它节点造成太多影响。当你在这些节点上放置这个元素时，一些其它在这个区域内的节点可能需要重绘，但是不需要回流
- 优化动画

## Vue 组件通信

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

## 父子组件生命周期

1. 父beforeCreate
2. 父created
3. 父beforeMount
4. 子beforeCreate
5. 子created
6. 子beforeMount
7. 子mounted
8. 父mounted
9. 父beforeUpdate
10. 子beforeUpdate
11. 子updated
12. 父updated
13. 父beforeDestroy
14. 子beforeDestroy
15. 子destroyed
16. 父destroyed

## new Set() 方法的作用

Set 是 es6 新增的数据结构，似于数组，但它的一大特性就是所有元素都是唯一的，没有重复的值，我们一般称为集合。Set本身是一个构造函数，用来生成 Set 数据结构

## super 关键字

super 关键字用于访问对象字面量或类的原型（[[Prototype]]）上的属性，或调用父类的构造函数

- 在派生类的构造函数体中（使用 extends），super 关键字可以作为“函数调用”（super(...args)）出现，它必须在使用 this 关键字之前和构造函数返回之前被调用。它调用父类的构造函数并绑定父类的公共字段，之后派生类的构造函数可以进一步访问和修改 this

```js
class Polygon {
  constructor(height, width) {
    this.name = 'Rectangle'
    this.height = height
    this.width = width
  }
  sayName() {
    console.log('Hi, I am a ', this.name + '.')
  }
  get area() {
    return this.height * this.width
  }
  set area(value) {
    this._area = value
  }
}

class Square extends Polygon {
  constructor(length) {
    this.height // ReferenceError，super 需要先被调用！

    // 这里，它调用父类的构造函数并传入 length
    // 作为 Polygon 的 height, width
    super(length, length)

    // 注意：在派生的类中，在你可以使用 'this' 之前，必须先调用 super()。
    // 现在可以使用 'this' 了，忽略 'this' 将导致引用错误（ReferenceError）
    this.name = 'Square'
  }
}
```

- 属性查询形式可以用来访问一个对象字面或类的 [[Prototype]] 的方法和属性。在一个类的主体中，super 的引用可以是父类的构造函数本身，也可以是构造函数的 prototype，这取决于执行环境是实例创建还是类的初始化

```js
class Rectangle {
  static logNbSides() {
    return 'I have 4 sides'
  }
}

class Square extends Rectangle {
  static logDescription() {
    return `${super.logNbSides()} which are all equal`
  }
}
Square.logDescription()
```

## Webpack 构建流程

- 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数
- 开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译； 确定入口：根据配置中的 entry 找出所有的入口文件
- 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行编译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
- 完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
- 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

## 加载 chunk 的原理

Chunk 不同于 entry、 output、module 这样的概念，它们对应着 Webpack 配置对象中的一个字段，Chunk 没有单独的配置字段，但却出现在 CommonsChunkPlugin（Webpack3 以前）、optimization.splitChunks（Webpack4 以后）这样的名称之中

Webpack 可以看做是模块打包器，我们编写的任何文件，对于 Webpack 来说，都是一个个模块。所以 Webpack 的配置文件，有一个 module 字段，module 下有一个 rules 字段，rules 下有就是处理模块的规则，配置哪类的模块，交由哪类 loader 来处理

Chunk 是 Webpack 打包过程中，一堆 Module 的集合。我们知道 Webpack 的打包是从一个入口文件开始，也可以说是入口模块，入口模块引用这其他模块，模块再引用模块。Webpack 通过引用关系逐个打包模块，这些 Module 就形成了一个 Chunk

## 常见的状态码

| 分类 | 描述                                           | 举例                                                                  |
| ---- | ---------------------------------------------- | --------------------------------------------------------------------- |
| 1**  | 信息，服务器收到请求，需要请求者继续执行操作   |                                                                       |
| 2**  | 成功，操作被成功接收并处理                     | 200: 请求成功;                                                        |
| 3**  | 重定向，需要进一步的操作以完成请求             | 301: 资源已经被永久移动;                                              |
| 4**  | 客户端错误，请求包含语法错误或无法完成请求     | 403: 拒绝执行此请求; 404: 无法找到请求的资源; 405: 请求的方法被禁止;  |
| 5**  | 服务器错误，服务器在处理请求的过程中发生了错误 | 505: 服务器不支持请求的 HTTP 版本; 500: 服务器内部错误，无法完成请求; |

## 缓存

基本的网络请求就是三个步骤：请求，处理，响应

前端缓存则可以在请求和响应中进行。在请求步骤中，浏览器也可以通过存储结果的方式直接使用资源，直接省去了发送请求；而响应步骤需要浏览器和服务器共同配合，通过减少响应内容来缩短传输时间

[重排(reflow)和重绘(repaint)](https://juejin.cn/post/6844904083212468238)  
[Vue——父子组件的生命周期（执行顺序）](https://blog.csdn.net/leilei__66/article/details/118699960)  
[MDN](https://developer.mozilla.org/)  
[一文说清 Webpack 的整体构建流程](https://zhuanlan.zhihu.com/p/611527476#:~:text=%E4%B8%80%E6%96%87%E8%AF%B4%E6%B8%85%20Webpack%20%E7%9A%84%E6%95%B4%E4%BD%93%E6%9E%84%E5%BB%BA%E6%B5%81%E7%A8%8B%201%20%E6%A0%B9%E6%8D%AE%20package.json%20%E9%87%8C%E7%9A%84%E5%91%BD%E4%BB%A4%E8%A1%8C%EF%BC%8C%E6%94%B6%E9%9B%86%E5%8F%82%E6%95%B0%EF%BC%8C%E5%86%8D%E5%88%B0%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E9%87%8C%E4%B9%9F%E6%94%B6%E9%9B%86%E5%8F%82%E6%95%B0%EF%BC%9B%202,%E6%A0%B9%E6%8D%AE%E5%85%A5%E5%8F%A3%E6%96%87%E4%BB%B6%EF%BC%8C%E6%9D%A5%E9%80%92%E5%BD%92%E6%A8%A1%E5%9D%97%E6%9F%A5%E6%89%BE%EF%BC%8C%E5%B9%B6%E6%A0%B9%E6%8D%AE%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%EF%BC%8C%E4%BD%BF%E7%94%A8%E5%AF%B9%E5%BA%94%E7%9A%84%20loader%20%E5%AF%B9%E6%A8%A1%E5%9D%97%E8%BF%9B%E8%A1%8C%E7%BC%96%E8%AF%91%E5%A4%84%E7%90%86%EF%BC%9B%205%20%E7%BC%96%E8%AF%91%E5%AE%8C%E6%88%90%E5%90%8E%EF%BC%8C%E8%BE%93%E5%87%BA%20chunk%EF%BC%8C%E8%A7%A6%E5%8F%91%E6%8C%82%E8%BD%BD%E9%92%A9%E5%AD%90%E4%B8%8A%E7%9A%84plugin%E4%BA%8B%E4%BB%B6%20%E6%9D%A5%E5%81%9A%E7%9B%B8%E5%BA%94%E5%A4%84%E7%90%86%EF%BC%8C%E6%9C%80%E5%90%8E%E8%BE%93%E5%87%BA%20bundle%EF%BC%9B)  
[理解 Webpack 中的 Chunk](https://cloud.tencent.com/developer/article/2321654)  
[一文读懂前端缓存](https://zhuanlan.zhihu.com/p/44789005)

```txt
新人发文，礼貌求关❤️
```
