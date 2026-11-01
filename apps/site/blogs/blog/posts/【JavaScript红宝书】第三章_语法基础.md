---
title: "【JavaScript红宝书】第三章 语法基础"
author: "Ari He"
date: "于 2023-02-25 14:41:18 发布"
source: "https://blog.csdn.net/m0_66681776/article/details/127682734?spm=1011.2415.3001.5331"
---

## 第三章 语言基础
 


### 3.1 语法
 


#### 3.1.1 区分大小写
 


```
{
let test = "small";
let Test = "big";
console.log(test);                  // small
console.log(Test);                  // big
}
```
 


#### 3.1.2 标识符
 


所谓标识符，就是变量、函数、属性或函数参数的名称。标识符可以由一个或多个拓展ASCII码字母/Unicode字母字符组成
 


##### 命名规则
 


- 第一个字符必须是一个字母、下划线或美元符号
- 后续字符可以是字母、下划线、美元符号或数字
 


#### 3.1.3 注释
 


ECMAScript采用C语言风格注释
 


```
// 单行注释
/*这是多行
注释*/ 
```
 


#### 3.1.4 严格模式
 


ES5增加了严格模式的概念。它会对ES3的一些不规则写法进行处理。启用方法是在JS文件开头添加预处理指令
 


```
"use strict"
```
 


#### 3.1.5 语句
 


ECMAScript的语句以分号结尾。省略分号意味着由解析器确定语句在哪里结尾
 


```
let sum = 1 + 2;                    // 加分号有效，推荐
let diff = 1 - 2                    // 不加分号也有效，但不推荐
console.log(sum);                   // 3
console.log(diff)                   // -1
```
 


即使语句的分号不是必需的，也应该加上
 


### 3.2 关键字与保留字
 


ECMAScript描述了一组保留的关键字，这些关键字有特殊用途。按照规定，保留的关键字不能用作标识符或属性名
 


### 3.3 变量
 


ECMAScript变量是松散型的，意思是变量可以用于保存任意类型的数据
 


#### 3.3.1  关键字
 


```
var msg = "hello";                  // 推荐
var message = "123";
message = 76;                       // 合法，但不推荐
```
 


##### 3.3.1.1 var 作用域
 


使用var定义的变量会场成为包括它的函数的局部变量。不过，在函数内部定义变量时省略var，可以创建一个全局变量
 


```
function test() {
    var test1 = 1;
    test2 = 2;
}
test();
console.log(test2);                 // 2
console.log(test1);                 // ! test1 is not defined
```
 


##### 3.3.1.2 var 声明提升
 


使用var声明的变量会自动提升到函数作用域的顶部。此外，反复多次var声明同一个变量也没有问题
 


```
console.log(hello);
var hello = "1212";                 // undefined
console.log(hello);                 // 1212
```
 


#### 3.3.2 let 声明
 


let声明和var差不多，二者最大的区别是let的作用域是块作用域，而var的作用域是函数作用域
 


```
if(true) {
    var name1 = "H1";
    let name2 = "H2";
}
console.log(name1);                 // H1
// ! test1 is not defined
// console.log(name2);
```
 


let声明不允许同一个块作用域中出现冗余声明，即使一个用var一个用let也无法避免。因为var和let声明的并不是不同类型的变量，它们只是指出了在相关作用域如何存在。
 


```
let xixi = 0;
// ! SyntaxError
// let xixi = 1; 
// ! SyntaxError
// var xixi = 1; 
```
 


##### 3.3.2.1 暂时性死区
 


let与var的另一个重要区别是let声明的变量不会在作用域中被提升
 


##### 3.3.2.2 全局声明
 


使用let在全局作用域中声明的变量不会成为window对象的属性
 


```
var happy = "1";
let sad = "0";
console.log(window.happy);
console.log(window.sad);
```
 


##### 3.3.2.3 条件声明
 


在使用var声明变量时，由于声明会被提升，JavaScript引擎会自动将多余的声明在作用域顶部合并为一个声明。因为let声明的作用域是块，所以不可能在前面检查是否已经使用let声明过同名变量，同时也就不可能在没有声明的情况下声明它。
 


##### 3.3.2.4 for 循环中的let 声明
 


在let出现之前，for循环定义的迭代变量会渗透到循环体内部，改用let后该问题会消失，因为迭代变量的作用域仅限单次迭代
 


```
for (let i = 0; i < 5; i++) {
    const element = array[i];
    setTimeout(() => console.log(i), 0);
}                               
// & 输出：0 1 2 3 4
for (var i = 0; i < 5; i++) {
    const element = array[i];
    setTimeout(() => console.log(i), 0);
}
// & 输出：5 5 5 5 5
```
 


#### 3.3.3 const 声明
 


const与let几乎完全一样，除了const的值不能修改并且conat值在定义时必须赋值
 


const的限制只适用于它指向的变量的引用。若它指向一个对象，那么对象内部的属性的变化是合法的
 


#### 3.3.4 声明风格及最佳实践
 


不使用var
 


const优先，let次之
 


### 3.4 数据类型
 


#### 3.4.1 typeof 操作符
 


typeof 可以用于确定任意变量的数值类型，有以下几个返回值：
 


```
undefined           表示值未定义
boolean             表示值为布尔值
string              表示值为字符串
number              表示值为数值
object              表示值为对象（而不是函数）或null
function            表示值为函数
symbol              表示值为符号
```
 


#### 3.4.2 Undefined 类型
 


Undefined 类型只有一个特殊值，就是undefined。当使用var或let声明变量未赋值时，就想当于给变量赋值了undefined值
 


**特殊：**
 


声明未定义的变量与未声明的变量有本质区别，前者有默认值undefined。然而，对二者调用typeof，返回的值都是undefined
 


```
// 未声明
// let age1;
// 声明未赋值
let age2;
console.log(age2);              // undefined
// console.log(age1);           报错
console.log(typeof age1);       // undefined
console.log(typeof age2);       // undefined
```
 


#### 3.4.3 Null 类型
 


Null类型只有一个值，即特殊值null。逻辑上讲，null值表示一个空对象，所以对其进行typeof 会返回object
 


在定义将要保存对象值的变量时，建议使用null来进行初始化
 


undefined是由null派生而来，所以对二者进行==，那么会返回true。但对二者进行===，会返回false
 


#### 3.4.4 Boolean 类型
 


要将一个值转化为布尔型，可以使用Boolean()转型函数
 


| 数据类型 | true | false |
| --- | --- | --- |
| String | 非空字符串 | “” |
| Number | 非零值（包括无穷大） | 0 |
| Object | 任意对象 | null |
| Undefined | N/A（不存在） | undefined |




像if这样的流程控制语句会自动执行其他类型值转换为布尔值
 


#### 3.4.5 Number 类型
 


Number包括了整型和浮点型。
 


整数也可以用八进制或十六进制来表示。对于八进制而言，第一个数字必须是0，然后是相应的八进制数字。如果字面量超过了八进制的范围，那么就会忽略前面的0，后面的数字序列也会被当作十进制数。八进制字面量在严格模式下是无效的
 


创建十六进制数必须在字面量前添加0x，十六进制数字中的大小写均可
 


##### 3.4.5.1 浮点值
 


要定义浮点值，数值中必须包含小数点，而且小数点后面必须至少有一个非零值
 


在小数点后面没有数字或全为0的情况下，数值就会变成整数。
 


##### 3.4.5.2 值的范围
 


ECMAScript可以表示的最大值保存在Number.MIN_VALUE中，最小值保存在Number.MIN_MAX中。如果超出范围，则会用\infinity和-\infinity表示正无穷大和负无穷大
 


测试某个值是不是无穷大可以用isFinity()
 


##### 3.4.5.3 NaN
 


NaN的含义是”不是数值“。例如，0除以0是NaN，任意值除以0都是无穷大（小）
 


任意涉及NaN的值的操作返回的始终是NaN，其次NaN不等于包括NaN在内的任意值。
 


```
console.log(NaN == NaN);        // false
```
 


可以用isNaN()函数测试某个变量是不是数值
 


##### 3.4.5.4 数值转换
 


有三个函数可以将非数值转换为数值：Number()，parseInt()，parseFloat()。Number可以用于任意数据类型，而后两者主要用于转数值
 


**Number转换规则：**
 


- 布尔值：true-&gt;1，false-&gt;0
- null：0
- undefined：NaN
- 字符串：包含数值字符，包括数值前的+/-，则转换为一个数值包含有效的浮点值格式，则转换为浮点型包含有效的十六进制格式，转化为十进制数值空字符串，返回0其他情况，返回NaN
- 对象：调用valueof()方法，然后按照字符串型转换规则返回值。如果是NaN，则使用toString()方法，再按照转换字符串规则
 


**parseInt转换规则：**
 


- parse更关注字符串是否包含数值模式
- 字符串最前面的空格会被忽略，从第一个非空格字符开始转换。如果第一个不是+/-/数值，则立刻结束，返回NaN，空字符串也是返回NaN
- 如果碰到非数值字符，则立刻停止转换，忽略后面的全部，返回已经转换完成的值
 


```
Number("   1234blue");		// 1234
Number("  .");			// NaN
```
 


- parseInt可以识别不同进制的数，如果以0x开头，则识别是十六进制，如果以0开头紧跟着数值字符，则为八进制数
 


```
Number("0xa1");			// 161
Number("011");			// 9
```
 


- parseInt也可以接受第二个参数，用于指定进制数
 


```
Number("a1",16);		// 161
```
 


**parseFloat转换规则：**
 


- 与parseInt差不多，但在第一次遇见小数点不会停止转换。
- 只解析十进制，不接受其他参数
 


#### 3.4.6  类型
 


##### 3.4.6.1 字符字面量
 


| 字面量 | 含义 |
| --- | --- |
| \n | 换行 |
| \t | 制表 |
| \b | 退格 |
| \r | 回车 |
| \f | 换页 |
| \\ | 反斜杠\ |
| \ ’ | 单引号‘ |
| \ " | 双引号“ |
| \ ` | 反引号` |
| \xnn | 以十六进制编码nn的字符 |
| \unnnn | 以十六进制编码nnnn的Unicode字符 |




字符字面量可以作为单个字符解释
 


```
let text = "12345678\\";
console.log(text.length);       // 9
```
 


##### 3.4.6.2 字符串的特点
 


ECMAS中的字符串是 `不可变`的。要修改，必须先销毁原来的字符串，然后包含新值的另一个字符串保存到该变量
 


```
let sen = "java";
sen = "java" + "script";
```
 


##### 3.4.6.3 转换为字符串
 


可以使用toString()的方法，功能是返回当前变量的字符串等价物。
 


该方法可用于数值、布尔值、对象和字符串，null和undefined不可使用。
 


toString()可以接受一个参数，用来指定数值转换的进制，
 


```
const num = 20;
console.log(num.toString());            // 20
console.log(num.toString(2));           // 10100
console.log(num.toString(8));           // 24
console.log(num.toString(16));          // 14
```
 


如果值有该方法，则调用并返回
 


若null调用该方法，返回null
 


若undefined调研该方法，则返回undefined
 


##### 3.4.6.4 模板字面量
 


模板字面量保留换行符，可以跨行定义字符串
 


```
const mod = `<div>
    <p>
</div>`;
console.log(mod);
/*
<div>
    <p>
</div>
*/
```
 


##### 3.4.6.5 字符串插值
 


模板字面量支持字符串插值，也就是在一个连续定义中连续插入多个值。技术上将，模板字面量不是字符串，而是一种特殊的JS，只不过求值后为字符串。模板字面量在定义的时候立即求值并转换为字符串实例。字符串插值通过在${}中定义一个JS表达式实现，任何插入的值都会使用toString()转换为字符串
 


在插值表达式中可以调用函数的和方法
 


```
const value = 5;
let exp1 = `second`;
let res = `${value} ro as ${exp1} ss ${value*value} 12c ${exp1.length}`;
console.log(res);                       // 5 ro as second ss 25 12c 6
```
 


##### 3.4.6.6 模板字面量标签函数
 


模板字面量也支持定义标签函数，而通过标签函数可以自定义插值行为。标签函数会接受被插值记号分割后的模板和每个表达式求值的结果
 


标签函数本身是一个常规函数，通过前缀到模板字面量来应用自定义行为。标签函数接收到的参数依次是原始字符串和每个表达式求值的结果
 


```
const a = 6;
const b = 7;
function simp(strings, summ, diff) {
    console.log(strings);                   // [ '', ' and ', '' ]
    console.log(summ);                      // 13
    console.log(diff);                      // -1
    return summ+diff;
}
let senc = `${a + b} and ${a - b}`;
let res = simp`${a + b} and ${a - b}`;
console.log(senc);                          // 13 and -1
console.log(res);                           // 12
```
 


因为表达式中的参数的数量是可变的，所以应该使用剩余操作符将他们收集到一个数组中。
 


```
const a = 10;
const b = 11;
function simpp(strings, ...expressions) {
    console.log(strings);
    for(let i = 0; i < expressions.length; i++) {
        console.log(expressions[i]);
    }
  
}
let senc = `${a} and ${b} and ${a+b} aa ${a-b}`;
let res = simpp`${a} and ${b} and ${a+b} aa ${a-b}`;
console.log(senc);
console.log(res);
```
 


##### 3.4.6.7 原始字符串
 


使用模板字面量可以直接获得原始的模板字面量内容，如换行符和Unicode字符，而不是被转义的
 


可以使用默认的String.raw标签函数
 


```
console.log(`12\t12`);		// 12       12
console.log(String.raw`12\t12`);	// 12\t12
```
 


也可以通过标签函数第一个参数，字符串数组的.raw属性取得每个字符串的原始字符串
 


```
function test(strings) {
    console.log("Actual");
    for(const string of strings) {
        console.log(string);
    }
    /*
    Actual
    ©
        ©
    */
    console.log("Raw");
    for (const rawString of strings.raw) {
        console.log(rawString);
    }
    /*
    \u00A9
    \t\u00A9
    */
}
test`\u00A9${'and'}\t\u00A9`;
```
 


#### 3.4.7 Symbol 类型
 


#### 3.4.8 Object 类型
 


每个Object实例都有如下属性和方法：
 


constructor：用于创建当前对象的函数
 


hasOwnProperty(propertyName)：判断当前对象是否已经存在给定的属性
 


isPrototypeof(object)：用于判断当前对象是否为另一个对象的原型
 


propertyIsEnumerable(propertyName)：判断给定的属性是否可以用for-in枚举
 


toLocaleString()：返回对象的字符串表示，该字串反映对象的本地化执行环境
 


toString()：返回对象的字符串表示
 


valueof()：返回对象对应的字符串、数值或布尔值表示
 


### 3.5 操作符
 


#### 3.5.1 一元操作符
 


##### 3.5.1.1 递增/递减操作符
 


前缀版：先递增，后赋值
 


后缀版：先赋值，后递增
 


```
let num = 5;
let res1 = num++;
let res2 = ++num;
console.log(res1);      // 5
console.log(res2);      // 7
```
 


##### 3.5.1.2 一元+/-符
 


对数值而言，就是普通的加减法
 


对非数值而言，会先进行Number()转化为数值再进行运算
 


#### 3.5.2 位操作符
 


计算机中，正数以原码的形式，复数以补码的形式存储。
 


例如-18就是：1111 1111 1111 1111 1111 1111 1110 1110
 


把负数输出为一个二进制串时，会得到一个加了符号的绝对值
 


```
let num = -18;
console.log(num.toString(2));			// "-10010"
```
 


特殊值NaN和Infinity会被当做0来处理
 


##### 3.5.2.1 按位与 &
 


##### 3.5.2.2 按位非 ~
 


对负数取非是对其补码取非
 


##### 3.5.2.3 按位或 |
 


##### 3.5.2.4 按位异或 ^
 


##### 3.5.2.5 左移 &lt;&lt;
 


零填充，但会忽略符号位，符号位不参与
 


##### 3.5.2.6 有符号右移 &gt;&gt;
 


零填充，但会忽略符号位，符号位不参与
 


##### 3.5.2.7 无符号右移 &gt;&gt;&gt;
 


零填充，但不会忽略符号位，符号位参与
 


#### 3.5.3 布尔操作符
 


##### 3.5.3.1 逻辑与 &&
 


会短路
 


##### 3.5.3.2 逻辑非 ！
 


##### 3.5.3.3 逻辑或 ||
 


会短路
 


#### 3.5.4 乘性操作符
 


##### 3.5.4.1 乘法操作符 *
 


##### 3.5.4.2 除法操作符 /
 


##### 3.5.4.3 取余操作符 %
 


#### 3.5.5 指数操作符 **
 


#### 3.5.6 加性操作符 +/-
 


#### 3.5.7 关系操作符 &gt;/&gt;=/&lt;=/&lt;
 


如果操作数是字符串，则会比较ASCII编码
 


```
let res = "B" < "a";    console.log(res);                   // T
let res2 = "B".toLowerCase() < "a";    console.log(res2);   // F
let res3 = "21" < "3";    console.log(res3);                // T
let res4 = "21" < Number("3");    console.log(res4);        // F
```
 


可以用toLowerCase()方法将大写都转为小写
 


任何涉及NaN的比较都返回false
 


```
console.log(1 < NaN);       // F
console.log(1 >= NaN);      // F
```
 


#### 3.5.8 相等操作符 /!=/=/!==
 


#### 3.5.9 条件操作符
 


```
variable = boolean_expression ? true_val : false_val;
```
 


#### 3.5.10 赋值操作符 =
 


#### 3.5.11 逗号操作符 ,
 


### 3.6 语句
 


#### 3.6.1 if 语句
 


```
if(condition) {
	statement1;
} else {
	statement2;
}
```
 


#### 3.6.2 do-while 语句
 


```
do {
	statement;
} while (expression);
```
 


#### 3.6.3 while 语句
 


```
while (expression) {
	statement;
}
```
 


#### 3.6.4 for 语句
 


```
for (initialization; expression; post-loop) {
	statement;
}
```
 


#### 3.6.5 for-in 语句
 


用于枚举对象中的非符号键属性（无法保证顺序）
 


```
for (const propName in object) {
	statements;
}
```
 


#### 3.6.6 for-of 语句
 


用于遍历可迭代对象的元素
 


```
for (const property of expression) {
	statements;
}
```
 


#### 3.6.7 标签语句
 


用于给语句加标签，可以在后文通过break&控制嵌套循环
 


```
start: for (let i = 0; i < 5; i++) {
	console.log(i);
}
```
 


#### 3.6.8 break 语句和continue 语句
 


##### 3.6.8.1 break
 


强制退出上一级循环，可以和标签语句一起使用，表示返回到代码中的特定位置，并执行下一条语句
 


```
let num = 0;
outermost:
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        if (i == 5 && j == 5) {
            break outermost;
        }
        num++;
    }
}
console.log(num);                   // 55
```
 


##### 3.6.8.2 continue
 


结束当前次循环，并立刻进入下一次循环，也可以与标签语句一起使用，但会循环重复指向
 


```
let num = 0;
outermost:
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        if (i == 5 && j == 5) {
            continue outermost;
        }
        num++;
    }
}
console.log(num);                   // 95
```
 


#### 3.6.9 with 语句
 


将代码的作用域设置为特定的对象
 


```
with (expression) {
	statement;
}
```
 


主要用于针对一个对象的反复操作
 


例如对于对象location，如果不用with
 


```
let qs = location.hostname;
let url = location.href;
```
 


但在with内
 


```
with (location) {
	let qs = hostname;
	let url = location.href;
}
```
 


#### 3.6.10  语句
 


```
switch (expression) {
	case value:
		statement;
	case value2:
		statement;
	default:
		statement;
}
```
 


如果表达式的值等于case内的值，则执行下面的语句，并继续匹配下一个条件。不只是数值，字符串、布尔值也是可以的
 


```
switch ("hello world") {
    case "hello" + " world":
        console.log("T");
        break;
    case "hello":
        console.log("T");
        break;
}
// T
```
 


```
switch (true) {
    case 1>2:
        console.log("1>2");
        break;
    case 1<2:
        console.log("1<2");
        break;
}
// 1<2
```
 


### 3.7 函数

---
> 原文链接: [【JavaScript红宝书】第三章 语法基础](https://blog.csdn.net/m0_66681776/article/details/127682734?spm=1011.2415.3001.5331)
> 作者: Ari He
