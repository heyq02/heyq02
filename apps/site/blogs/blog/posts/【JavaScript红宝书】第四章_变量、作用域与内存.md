---
title: "【JavaScript红宝书】第四章 变量、作用域与内存"
author: "Ari He"
date: "于 2023-02-25 14:36:12 发布"
source: "https://blog.csdn.net/m0_66681776/article/details/127694841?spm=1011.2415.3001.5331"
---

## 第四章 变量、作用域与内存



### 4.1 原始值与引用值



6种原始值：Undefined、Null、、Number、String和Symbol。保存原始值的变量是按值访问的



引用值是保存在内存中的对象，不允许直接访问内存位置，也就不能直接操作对象所在的内存空间。在操作对象时，实际上操作的是对该对象的引用而非对象本身



#### 4.1.1 动态属性



引用值可以随意添加其属性和方法



原始值型的初始化必须使用原始值字面量的形式。如果使用的是new的方法，则会创建一个Object类型的实例，但其行为类似原始值



```
let name1 = "Nico";
let name2 = new String("Mark");
name1.age = 27;
name2.age = 28;
console.log(name1.age);             // undefined
console.log(name2.age);             // 28
```



#### 4.1.2 复制值



在通过变量把一个原始值赋值给另一个变量时，原始值会被复制到新变量的位置



```
let num1 = 5;
let num2 = num1;
num2++;
console.log(num1);		// 5
```



而如果是引用值从一个变量赋值给另一个变量，那么这个复制的值实际上是一个指针，两个变量其实指的是同一个对象。



```
const obj1 = new Object();
const obj2 = obj1;
obj2.le = "12";
console.log(obj1.le);               // 12
```



#### 4.1.3 传递参数



按值传递参数时，对形参的修改不会影响实参



按引用传递参数时，对形参的修改会影响实参



```
function test(objjj) {
    objjj.name = "hyq";
}
let obj3 = new Object();
test(obj3);
console.log(obj3.name);
```



#### 4.1.4 确定类型



instanceof可以判断变量是否为某类型的对象



```
let color = new Array();
console.log(color instanceof Array);		// true
```



### 4.2 执行与作用域



时的标识符解析是通过沿作用域链逐级搜索标识符名称完成的，直到找到标识符。



内部上下文可以通过作用域链访问外部上下文中的一切，但外部上下文无法访问内部上下文中的任何东西



#### 4.2.1 作用域链增强



某些语句会导致在作用域链前端临时添加一个上下文



- try/catch语句的catch块
- with语句



对with而言，会向作用域前端添加指定的对象；对catch而言，会创建一个新的变量



#### 4.2.2 变量声明



### 4.3 垃圾回收



确定哪个变量不会使用，然后释放它占的内存。这个过程是周期性的，即垃圾回收程序每隔一定时间自动运行



#### 4.3.1 标记清理



#### 4.3.2 引用计数



把变量设置为null可以切断变量与其之前引用值的关系，下次垃圾回收程序运行时便会回收



#### 4.3.3 性能



IE7后，JS的垃圾回收机制调整为动态改变分配变量、字面量或数组槽位等会触发垃圾回收的阈值



#### 4.3.4 内存管理



如果数值不再必要，将其设置为null，从而释放引用，也叫做解除引用。



##### 4.3.4.1 通过const和let声明提升性能



##### 4.3.4.2 隐藏类和删除操作



运行期间，V8会将创建的对象与隐藏类关联起来，以跟踪它们的属性特征。建议在中一次性声明所有变量，防止动态补充属性多次触发回收阈值，提升性能



```
function Arct (op ) {
    this.name = "heyq";
    this.age = op;
}
let Arct1 = new Arct(15);
let Arct2 = new Arct(14);
```



这样，两个实例就基本一样了，可以带来潜在的性能提升。不过，delete会导致生成相同的隐藏类片段



```
function Arct (op ) {
    this.name = "heyq";
    this.age = op;
}
let Arct1 = new Arct(15);
let Arct2 = new Arct(14);
delete Arct2.name;
```



在代码结束后，即使两个值使用了同一个构造函数，也不会共享一个隐藏类。最佳实践是把不想要的属性设置为null。



##### 4.3.4.3 内存泄漏



##### 4.3.4.4 静态分配和对象池



为了提升性能，最好不要用动态分配效果，而是预先定义一个足够大的数组（对象池）进行静态分配

---
> 原文链接: [【JavaScript红宝书】第四章 变量、作用域与内存](https://blog.csdn.net/m0_66681776/article/details/127694841?spm=1011.2415.3001.5331)
> 作者: Ari He
