---
title: JS 学习笔记：DOM 节点综述
description: 梳理 DOM 的节点类型与关系：Node、Document、Element、Text，以及增删改查常用 API。
date: 2023-02-25
---

# JS 学习笔记：DOM 节点综述

## 1 DOM中的节点

### 1.1 概述

#### 1.1.1 Node介绍

任何都可以用DOM表示为一个由节点Node构成的层级结构。没一个Node节点都有一个nodeType属性，包含了全部12种节点的类型

| 节点类型                    | 数值常量 |
| --------------------------- | -------- |
| ELEMENT_NODE                | 1        |
| ATTRIBUTE_NODE              | 2        |
| TEXT_NODE                   | 3        |
| CDATA_SECTION_NODE          | 4        |
| ENTITY_REFERENCE_NODE       | 5        |
| BNTITY_NODE                 | 6        |
| PROCESSING_INSTRUCTION_NODE | 7        |
| COMMENT_NODE                | 8        |
| DOCUMENT_NODE               | 9        |
| DOCUMENT_TYPE_NODE          | 10       |
| DOCUMENT_FRAGMENT_NODE      | 11       |
| NOTATION_NODE               | 12       |

```javascript
const judge = document.nodeType == Node.DOCUMENT_NODE ? '' : 'not '
console.log(`The document.nodeType is ${judge}Node.DOCUMENT_NODE`)
```

Node的属性nodeName、nodeType完全取决于节点类型。在使用该属性前，最好先检验节点类型

#### 1.1.2 节点关系

每个Node都有一个childNodes属性，其中包含一个NodeList实例。它是一个类数组，可以length查看长度，也可以[]输入索引号。但这个类数组不是Array的实例，会动态地随着DOM的变化而发生改变

```javascript
const boxChildNodes = document.querySelector('#box').childNodes
for (let i = 0; i < boxChildNodes.length; i++) {
  console.log(boxChildNodes[i])
}
```

使用Array.proptotype.slice()/Array.from()可以把NodeList转化为数组对象

```javascript
const boxChildNodes = document.querySelector('#box').childNodes
console.log(boxChildNodes instanceof Array)
const boxChildNodesArray1 = Array.prototype.slice(boxChildNodes)
console.log(boxChildNodesArray1 instanceof Array)
const boxChildNodesArray2 = Array.from(boxChildNodes)
console.log(boxChildNodesArray2 instanceof Array)
```

每个节点都有一个parentNode、previousSibling和nextSibling，分别指向父节点，上一个兄弟节点和下一个兄弟节点

```javascript
const boxChildNodes = document.querySelector('#box').childNodes
for (let i = 1; i <= 3; i++) {
  console.log(boxChildNodes[i])
}
console.log(boxChildNodes[2].previousSibling)
console.log(boxChildNodes[2])
console.log(boxChildNodes[2].nextSibling)
console.log(boxChildNodes[2].parentNode)
```

firstChild和lastChild分别指向ChildNode的第一个和最后一个子节点

```javascript
const box = document.querySelector('#box')
console.log(box.firstChild.nextSibling)
console.log(box.lastChild.previousSibling)
```

可以用hasChildNodes()方法测试节点是否有1个/多个子节点

```javascript
const box = document.querySelector('#box')
const child = box.childNodes[2]
console.log(box.hasChildNodes())
console.log(child.hasChildNodes())
```

每个节点都有owenrDocument属性，指向整个页面的文档节点

```javascript
const box = document.querySelector('#box')
console.log(box.ownerDocument)
```

#### 1.1.3 操纵节点

可以用appendChild()在当前元素添加最后一个子节点，该方法的返回值是新添加的那个节点。

```javascript
const box = document.querySelector('#box')
const secondChild = box.childNodes[1]
box.appendChild(secondChild)
```

如果想把节点放在指定位置，可以用insertBefore()方法。该方法接受两个参数，分别是要插入的节点和节点位置。

```javascript
const box = document.querySelector('#box')
const secondChild = box.childNodes[1]
const forthChild = box.childNodes[3]
box.insertBefore(forthChild, secondChild)
```

replaceChild()接受两个参数：要插入的节点和要替换的节点。要替换的节点会被返回并从文档中完全移除，所有的关系指针都会被替换的节点复制过来

```javascript
const box = document.querySelector('#box')
for (const child of box.childNodes) {
  console.log(child)
}
const newNode = document.createElement('p')
newNode.innerText = '插入段'
box.replaceChild(newNode, box.childNodes[1])
console.log('替换后')
for (const child of box.childNodes) {
  console.log(child)
}
```

removeChild()接受一个参数，直接移除该节点并返回

#### 1.1.4 复制节点

所有节点还共享了一个cloneNode()方法，会返回和调用它的节点一模一样的节点。接受一个布尔参数，true表示深复制，会复制整个节点及其DOM树，false表示浅复制，只复制调用该方法的节点。复制完成的节点是孤儿节点，没有父元素，可以用上述方法将其添加父元素

```javascript
const box = document.querySelector('#box')
const box_cp = box.cloneNode(true)
box.parentNode.appendChild(box_cp)
```

### 1.2 Document类型

#### 1.2.1 Document概述

Document类型是JavaScript中表示浏览器节点的类型。在浏览器中，文档对象是HTMLDocument的实例，表示整个页面。document是对象的属性，因此是一个全局对象，特征如下：

- nodeType=9
- nodeName = “#document”
- nodeValue = null
- parentValue = null
- owerDocument = null
- 子节点可以是DocumentType（<=1），Element（<=1），ProcessingInstruction或Comment类型

document提供了两个访问子节点的快捷方式，第一个是documentElement属性，始终指向 `<html>`元素；另一个是document.body属性，始终指向 `<body>`元素

```javascript
const html = document.documentElement;

for (const child of document.childNodes) {
    console.log(child);
}

console.log(html === document.childNodes[1]);
const body = document.body;

console.log(body === document.childNodes[1].childNodes[2]);
}
```

document中<!DOCTYPE>也是一种类型为DocumentType类型的节点，其属性可以通过document.doctype来访问

document作为文档节点，还有一些其他节点没有是属性，包括title（文档标题）、url（网址）、domain（页面域名）、referer（链接到当前页面的之前的页面URL）。domain可以用于跨源通信，但浏览器对其有所限制，只能放松，无法收紧，例如设置为wrox.com后就不能再设置为p2p.wrox.com

#### 1.2.2 定位元素

document的getElementById()方法，可以通过id定位第一个匹配的节点

```javascript
const ps = document.getElementsByTagName('p')
for (const p of ps) {
  console.log(p)
}
console.log(ps['second'])
```

documen的getElementsByTagName()方法，可以返回一个HTMLCollection（类似NodeList）。但是HTMLCollection还有额外的一种方法，可以通过标签的name属性索引元素

```javascript
const ps = document.getElementsByName('second')
for (const p of ps) {
  console.log(p)
}
```

#### 1.2.3 特殊属性

document额外携带了一些特殊属性，可以快捷访问节点：

document.anchord包含文档中所有带name属性的 `<a>`元素

document.forms包含文档中所有 `<form>`元素

document.images包含文档中所有 `<img>`元素

document.links包含文档中所有的带href属性的 `<a>`元素

它们的内容也会随着DOM实时更新

#### 1.2.4 写入元素

document有四种方法用于向网页流写入内容，write()，writeln()，open()，close()。前两者的区别在于writeln()会在完成write后再写入一个\n。但如果是在页面加载完成后使用write，会重写整个页面！open和close用于打开和关闭网页输出流。

### 1.3 Element 类型

#### 1.3.1 Element概述

Element类型标识HTML中的元素，对外暴露出访问元素标签名，子节点和属性的能力。具有以下特征

- nodeType=1
- nodeName值为元素标签名
- nodeValue值为null
- parentNode的值为Document或element对象

可以通过nodeName和tagName来获取元素标签名，二者等价。

```javascript
const box = document.getElementById('box')
console.log(box.nodeName)
console.log(box.nodeName === box.tagName)
```

HTMLElement直接继承了Element并添加了一些属性：

id、title、lang、dir（页面文本对齐方式）、className

#### 1.3.2 操纵属性

可以使用getAttribute()、setAttribute()和removeAttribute()操作元素的属性，包括自定义属性

```javascript
const box = document.getElementById('box')
box.setAttribute('data-num', '11')
console.log(box.getAttribute('data-num'))
```

HTMLElement还有一个很重要的属性，attribute。元素的所有属性都被保存在这个属性中，它是一个NameNodeMap，一个类似NodeList的集合。其中的方法有getNamedItem(name)，removeNamedItem(name)，setNamedItem(name)，item(pos)。最后一个是返回某属性的索引。

```javascript
const box = document.getElementById('box')
const boxId = box.attributes.getNamedItem('id').nodeValue
console.log(boxId)
```

#### 1.3.3 创建元素

document.createElement()方法可以用来创建元素（孤儿节点），可以先添加属性，然后加入到DOM书中。

```javascript
const box = document.getElementById('box')
const newP = document.createElement('p')
newP.setAttribute('id', 'new')
newP.innerText = '新加段'
box.appendChild(newP)
```

### 1.4 Text 类型

#### 1.4.1 Text概述

Text节点由Text类型表示，包含字面解释的纯文本，可以包含转义后的HTML字符，但不含HTML代码。它有以下特征：

- nodeType=3
- nodeName=“#text”
- nodeValue值为节点中包含的文本
- parentNode的值为Element对象
- 没有子节点

#### 1.4.2 基本方法

文本节点有以下方法：

- appendData(text)向节点末尾添加文本text
- deleteData(offset,count)从索引offset开始删除count个字符
- insertData(offset,text)在索引offset处添加文本text
- replaceData(offset,count,text)用text替换位置offset到offset+count的文本
- splitText(offset)，在位置offset将文本节点拆分两个节点
- substringData(offset,count)提取从位置offset到offset+count的文本

document.createTextNode()可以用来创建新文本节点，接受一个参数即待插入节点的文本

normalize() 是 Element 类型的一种方法，用于合并其相邻文本子节点

```javascript
const p = document.getElementById('box').childNodes[1]
let text1 = document.createTextNode('text1')
let text2 = document.createTextNode('text2')
p.appendChild(text1)
p.appendChild(text2)
console.log(p.childNodes.length)
p.normalize()
console.log(p.childNodes.length)
```

splitText()是和normalize()相反的方法，接受一个参数offset，从offset位置将其拆分

> 参考书籍：
> Matt Frisbie 《JavaScript高级程序设计》（第四版）
> Jeremy Keith&Jeffrey Sambells 《JavaScript DOM编程艺术》（第二版）
