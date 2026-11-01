---
title: "【深入剖析JavaScript中的对象】"
author: "Ari He"
date: "于 2023-02-25 14:35:50 发布"
source: "https://blog.csdn.net/m0_66681776/article/details/127935901?spm=1011.2415.3001.5331"
---

## 深入剖析JavaScript中的对象



> 
> 🎓JavaScript中的对象的内容十分繁杂，包括对象属性、合并对象、对象解构、创建对象、继承等方面。本文系统地阐述了JavaScript的对象的特性及其基础的方法，并附加了示范代码供参考。
> 💝内容仅供借鉴，如有有失偏颇之处，望读者多多包含。
> 🏆参考书籍《JavaScript高级程序设计》
> 



### 1 理解对象



ECMA-262将对象定义为一组属性的无序集合。可以把对象想象成一张散列表，其中的内容就是一个名/值对，值可以是数据或者函数。



创建自定义对象的通常方式是创建Object的一个新实例，然后再给它添加属性和方法。



也可以通过字面量的方式创建对象。



#### 1.1 属性的类型



ECMA262使用一些内部特性来描述属性的特征。开发者不能在JS中直接访问这些特征。通常这样的特征会用两个中括号把特性的名称包裹起来。



##### 1.1.1 数据属性



数据属性包含一个保存数据值的位置。有四个值用于描述数据的属性：



- [[Configurable]]：表述属性是否可以通过delete删除并重新定义，是否可以修改它的特性，是否可以把它修改为访问器属性。默认true。
- [[Enumberable]]：表示属性是否可以通过for-in循环返回。默认true。
- [[Writable]]：表示属性的值是否可以修改。默认true。
- [[Value]]：包含属性实际的值。默认undefined。



要修改数据属性的，必须使用Object.defineProperty()方法。



```javascript
const person = new Object();
Object.defineProperty(person, "name", {
    configurable: false,        // 禁止删除
    enumerable: true,           // 可以迭代
    writable: false,            // 不可修改
    value: "HeYQ",              // 属性实际值
});
delete person.name;             // 尝试删除属性
console.log(person.name);       // HeYQ
```



##### 1.1.2 访问器属性



访问器属性不包含数据值。相反，它们包含一个获取函数和设置函数，不过都不是必须的。在读取访问器属性时，会调用获取函数，这个函数的责任就是返回一个有效的值。在写入访问器属性时，会调用设置函数并传入新值，这个函数必须决定对数据做出什么修改。



- [[Configurable]]：表示属性是否可以通过delete删除并重新定义，是否可以修改它的属性，是否可以把它修改成数据属性。默认true。
- [[Enumerable]]：表示属性是否可以通过for-in循环返回。默认true。
- [[Get]]：获取函数。默认undefined。
- [[Set]]：设置函数。默认undefined。



访问器属性必须通过Object.defineProperty()定义。



```javascript
const book = {
    year_: 2017,
    edition: 1,
};
Object.defineProperty(book, "year", {
    get() {
        return this.year_;
    },
    set(newValue) {
        if(newValue > this.year_) {
            this.year_ = newValue;
            this.edition += 1;
        }
    },
});
book.year = 2016;
console.log(book.year);                     // 2017
console.log(book.edition);                  // 1
book.year = 2019;
console.log(book.year);                     // 2019
console.log(book.edition);                  // 2
```



#### 1.2 定义多个属性



Object.defineProperties()用于同时定义多个属性。



此方法定义的属性的默认值与直接定义的**默认值不同**。



```javascript
// const book = {
//     year_: 2017,
//     edition: 1,
// };
// Object.defineProperty(book, "year", {
//     get() {
//         return this.year_;
//     },
//     set(newValue) {
//         if(newValue > this.year_) {
//             this.year_ = newValue;
//             this.edition += 1;
//         }
//     },
// });
let book = {};
Object.defineProperties(book,{
    year_: {
        writable: true,                 // 默认值为false
        value: 2017,
    },
    edition: {
        // writable: true,
        value: 1,
    },
    year: {
        get() {
            return this.year_;
        },
        set(newValue) {
            if(newValue > this.year_) {
                console.log("newValue: " + newValue);
                console.log("修改前" + this.year_);
                this.year_ = newValue;
                console.log("修改this.year_");
                console.log("修改后" + this.year_);
                this.edition += 1;
            }
        },
    }
});
book.year = 2016;
console.log(book.year);                     // 2017
console.log(book.edition);                  // 1
book.year = 2019;
console.log(book.year);                     // 2019
console.log(book.edition);                  // 2
```



#### 1.3 读取属性的特性



使用Object.getOwnPropertyDescriptor方法可以取得指定属性的属性描述符。



使用Object.getOwnPropertyDescriptors方法可以取得指定对象的全部属性及其描述符。



```javascript
let book = {};
Object.defineProperties(book,{
    year_: {
        writable: true,                 // 默认值为false
        value: 2017,
    },
    edition: {
        // writable: true,
        value: 1,
    },
    year: {
        get() {
            return this.year_;
        },
        set(newValue) {
            if(newValue > this.year_) {
                console.log("newValue: " + newValue);
                console.log("修改前" + this.year_);
                this.year_ = newValue;
                console.log("修改this.year_");
                console.log("修改后" + this.year_);
                this.edition += 1;
            }
        },
    }
});
const year = Object.getOwnPropertyDescriptor(book, "year");
console.log(typeof year.set);                                   // function
const year_ = Object.getOwnPropertyDescriptor(book, "year_");  
console.log(year_.value);                                       // 2017
const yearPro = Object.getOwnPropertyDescriptors(book);
console.log(yearPro);
/* {
    year_: {
      value: 2017,
      writable: true,
      enumerable: false,
      configurable: false
    },
    edition: { value: 1, writable: false, enumerable: false, configurable: false },
    year: {
      get: [Function: get],
      set: [Function: set],
      enumerable: false,
      configurable: false
    }
  } */
```



#### 1.4 合并对象



把源对象（&gt;=1）所有的本地属性一起赋值到目标对象上，这种操作叫做合并/混入。JS为合并对象提供了Object.assign()方法。这个方法接受一个目标对象和多个源对象作为参数，然后将每个源对象中可枚举（用Object.propertyIsEnumerable测试）和自有（Object.hasOwnProperty测试是否存在某属性）属性复制到目标对象。



**无法在两个对象间转移获取函数和设置函数**。



- 将源对象的访问器属性直接复制到目标对象时，会激活访问器的get方法并转换为一个数据对象。

```javascript
const SRC = {
    testSRC: "这是SRC的testSRC属性",
};
Object.defineProperty(SRC, "test", {
    enumerable: true,
    get() {
        return "这是SRC的test访问器";
    },
    set(newValue) {
        this.testSRC = "这是被访问器修改的SRC的testSRC属性    " + newValue;
    }
});
const DES = {

};
const mix = Object.assign(DES, SRC);
// ! 源对象的访问器属性复制到目标对象内
// 激活了访问器的get函数，返回的值就是目标对象内的value值
// set函数被忽略抛弃
// 访问器属性转化为数据属性
console.log(Object.getOwnPropertyDescriptors(mix));
// {
//     testSRC: {
//       value: '这是SRC的testSRC属性',
//       writable: true,
//       enumerable: true,
//       configurable: true
//     },
//     test: {
//       value: '这是SRC的test访问器',
//       writable: true,
//       enumerable: true,
//       configurable: true
//     }
// }
```

- 将源对象的数据对象覆盖到目标对象的访问器属性时，会激活访问器属性的set方法，其获取的值就是源对象的对应数据对象的值。其他属性不会覆盖

```javascript
const SRC = {
    testSRC: "这是SRC的testSRC属性",
};
Object.defineProperty(SRC, "testSRC", {
    enumerable: false,
});
const DES = {
    set_res: "这是未被访问器修改的DES的set_res属性",
}
Object.defineProperty(DES, "testSRC", {
    enumerable: true,
    get() {
        return "这是DES的testSRC访问器";
    },
    set(newValue) {
        this.set_res = "这是被访问器修改的DES的set_res属性    " + newValue;
    }
});
const mix = Object.assign(DES, SRC);
// ! 源对象的数据属性覆盖目标对象的访问器属性
// 激活了访问器的set函数，接收的值就是源对象数据属性的value
// 源对象的数据属性的enu...不会覆盖目标对象访问器的enu...
console.log(Object.getOwnPropertyDescriptors(mix));
// {
//     set_res: {
//       value: '这是未被访问器修改的DES的set_res属性',
//       writable: true,
//       enumerable: true,
//       configurable: true
//     },
//     testSRC: {
//       get: [Function: get],
//       set: [Function: set],
//       enumerable: true,
//       configurable: false
//     }
//   }
```

- 将源对象的访问器属性覆盖到目标属性的数据属性时，会激活访问器的get方法，将数据属性的值覆盖为get返回值。其他属性不会覆盖

```javascript
const SRC = {
    testSRC: "这是SRC的testSRC属性",
};
Object.defineProperty(SRC, "test", {
    enumerable: true,
    get() {
        return "这是SRC的test访问器";
    },
    set(newValue) {
        this.testSRC = "这是被访问器修改的SRC的testSRC属性    " + newValue;
    }
});
const DES = {
    test: "这是DES的test值",
};
Object.defineProperty(DES, "test", {
    enumerable: false,
});
console.log(Object.getOwnPropertyDescriptors(DES));
const mix = Object.assign(DES, SRC);
// ! 源对象的访问器属性覆盖目标对象的数据属性
// 激活了访问器的get函数，并将数据属性的value值覆盖为get返回值
// 源对象的访问器属性的enu...不会覆盖目标对象的数据属性的enu...
console.log(Object.getOwnPropertyDescriptors(mix));
// {
//     test: {
//       value: '这是SRC的test访问器',
//       writable: true,
//       enumerable: false,
//       configurable: true
//     },
//     testSRC: {
//       value: '这是SRC的testSRC属性',
//       writable: true,
//       enumerable: true,
//       configurable: true
//     }
// }
```




对对象的复制是**浅复制**，源对象复制到目标函数/结果函数的属性会在源和目标直接同步传递。



```javascript

const SRC = {
    sons: {
        son1: "SRC_1",
        son2: "SRC_2",
    },
};
const DES = {

};
const mix = Object.assign(DES, SRC);
mix.sons.son1 =  "MIX_1";
console.log(SRC.sons.son1);             // MIX_1
```



assign是一个尽力而为的操作，若在复制中途出错，则不会进行回退，直接复制成功的属性依旧存在。



#### 1.5 对象标识及相等判定



在传统的===中，有些特殊情况很难判断，ES6引入了Object.is()可以帮助判断相等性。



```javascript
console.log(true === 1);            // false
console.log({} === {});             // false
console.log("2" === 2);             // false

console.log(+0 === -0);             // true
console.log(+0 === 0);              // true
console.log(-0 === 0);              // true

console.log(NaN === NaN);           // false
console.log(isNaN(NaN));            // true

console.log(Object.is(true, 1));    // false
console.log(Object.is({}, {}));     // false
console.log(Object.is("2", 2));     // false

console.log(Object.is(+0, -0));     // false
console.log(Object.is(+0, 0));      // true
console.log(Object.is(-0, 0));      // false

console.log(Object.is(NaN, NaN));   // true
```



#### 1.6 增强的对象语法



##### 1.6.1 属性值简写



在给对象添加变量的时候，如果属性名和变量名是一样的。只要使用变量名（不再写冒号）就会自动解释为同名的属性键。如果没有找到同名变量，则会抛出ReferenceError。



```javascript
let Name = "HYQ";
const person = {
    Name,
};
console.log(person.Name);
```



##### 1.6.2 可计算属性



传统使用变量作为属性名的方法是先声明对象，然后使用中括号来添加属性，无法在字面量中添加。



有了可计算属性，就可以在对象字面量中动态添加属性键。



而可计算属性本身也可以是复杂的。



```javascript
let Name = "HYQ";
const person = {
    Name,
};
console.log(person.Name);
```



##### 1.6.3 简写方法名



在定义对象方法的时候，通常都要写一个方法名、冒号、然后跟一个匿名函数表达式。



但现在开发者要放弃给函数命名，直接书写函数名和函数体。



此方法也适用于访问器函数的设置。



```javascript
const person1 = {
    myName: "Hyq",
    sayHello: function(personName) {
        console.log(`Hello ${personName}`);
    },
};
Object.defineProperty(person1, "name", {
    get() {
        return this.myName;
    },
})
person1.sayHello("Nancy");
console.log(person1.name);

const person2 = {
    myName: "Ld",
    sayHello(personName) {
        console.log(`Hello ${personName}`);
    },
    get name() {
        return this.myName;
    }
};
person2.sayHello("Jack");
console.log(person2.name);
```



#### 1.7 对象解构



在一条语句中使用嵌套数据实现一次性赋值多个变量。简单来说，对象解构就是使用与对象匹配的解构来实现对象属性赋值。



解构赋值不一定与对象的属性匹配。如果不匹配，就会赋值Undefined。可以在解构赋值的同时定义默认值，就可以适用于前者未匹配到的情况。



解构在内部使用函数ToObject()将源数据转换为对象。这意味着在对象解构的中，原始值会被当做对象来看。因此null和undefined不能被解构。



解构并不要求变量必须在解构表达式中声明，但如果是给事先声明的变量赋值，那么必须添加括号。



```javascript
let person = {
    name: "HYQ",
    age: 18,
};
let {name: personName, age: personAge} = person;
console.log(personName);                            // HYQ
console.log(personAge);                             // 18
let {personName2, personAge2} = person;
console.log(personAge2);                            // undefined

let {name, personGender="male", age} = person;

let personName4 = null;
let personAge4 = null;
({name: personName4, age: personAge4} = person);
console.log(personAge4);

```



##### 1.7.1 嵌套解构



此种解构是浅赋值，对解构对象的对象属性的改变也会反映在源对象的对象属性上。



在外层属性没有定义的情况下不能使用嵌套解构。无论源、目都一样。



```javascript
let person = {
    name: "HYQ",
    age: 18,
    job: {
        title: "HC"
    },
};
let personCopy = {};
({name: personCopy.name, age: personCopy.age, job: personCopy.job} = person);
console.log(personCopy);
personCopy.job.title = "CCC";
console.log(person.job.title);    // CCC

let person2 = {
    job: {
        title: "HC",
    },
};
// ({jobb: {title: namee}} = person);
let person3 = {
    namee: "123",
    job: {
        title: "HC",
    },
};
({jobb: {title: namee}} = person3);
```



##### 1.7.2 部分解构



如果一个解构表达式涉及多个赋值，如果开始的赋值成功而中途出错，那么程序立刻停止并不会回退已成功赋值变量。



##### 1.7.3 参数上下文匹配



在函数的参数列表中也可以进行解构赋值，不会影响arguments对象，但可以声明在函数内部使用局部变量。



```javascript
function test(a, {num1, num2}, b) {
    console.log(arguments);
    return a + num1 + num2 + b;
};

res = test(11,{num1: 1, num2: 2}, 12);
console.log(res);
```



### 2 创建对象



#### 2.1 工厂模式



用于抽象创建特定对象的过程。



工厂模式虽然可以解决创建多个类似对象的问题，但没有解决对象标识的问题。



```javascript
/**
 * @param {string} name
 * @param {number} age
 * @param {string} job
 * @return {object} obj
 */
function createPerson(name, age, job) {
    const obj = new Object();
    obj.name = name;
    obj.age = age;
    obj.job = job;
    obj.sayName = function() {
        console.log(this.name);
    };
    return obj;
}
const person1 = createPerson("hyq",18,"stu");
const person2 = createPerson("ld",38,"tea");

```



#### 2.2 模式



ECMA中的构造函数是用于创建特定类型对象的。



构造函数与工厂函数的内容具有很大的相似性，关键差别有以下几点：



- 没有显式创建对象
- 属性和方法直接赋值给了this
- 没有return



使用new+构造函数创建对象的步骤：



1. 在内存中创建一个新对象
2. 这个新对象的[[prototype]]特性被赋值为构造函数的Prototype属性
3. 构造函数内部的this被赋值为这个新对象
4. 执行构造函数内部的代码
5. 如果构造函数返回非空对象，则返回该对象。否则返回刚刚创建的新对象



定义自定义构造函数的方法可以确保实例被标识为特定类型。在实例化的时候，如果不加括号传参也可以。



```javascript
/**
 * @param {string} name
 * @param {number} age
 * @param {string} job
 * @return {objective}
 */
const Person  = function(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
};
const person1 = new Person("HYQ", 18, "STU");
console.log(person1 instanceof Person);         // true
```



##### 2.2.1 构造函数&普通函数



构造函数与普通函数的唯一区别就是调用方式的不同。除此之外，构造函数也是函数。任何函数只要使用new操作符调用就是构造函数。



在调用一个函数而没有指明的值的时候（使用call/apply或作为对象的方法），this默认指向Global对象，在浏览器中就是windows对象



```javascript
/**
 * @param {string} name
 * @param {number} age
 * @param {string} job
 * @return {objective}
 */
 const Person  = function(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
};
const person1 = new Person("HYQ", 18, "STU");
console.log(person1 instanceof Person);         // true
const obj = {};
Person.call(obj, "HYQ", 19, "STU");
console.log(obj.name);                          // HYQ
```



##### 2.2.2 构造函数的缺点



构造函数定义的方法会在每一个实例上都创建一遍，导致相同逻辑的函数重复定义。



#### 2.3 原型模式



每个函数都会创建一个Prototype对象，这就是使用构造函数创建对象的原型。使用原型对象，那么它定义的全部属性和方法都会被全部对象实例共享。所有对象实例访问的都是想要的属性和方法。



##### 2.3.1 理解原型



无论何时，只要创建一个函数，就会按照特定的规则创建一个Prototype属性，这个指向函数的原型对象。默认情况下，所有原型对象获得一个constructor属性，指向原型对象的构造函数。



自定义构造函数的时候，原型对象默认只会获得constructor属性，其他的所有方法属性都继承自Object。每次调用这个构造函数创建实例，这个实例的内部[[prototype]]都会自动被赋值为构造函数的原型对象。浏览器在实例上暴露了__prpto__属性，指向该对象的原型。**实例与构造函数原型有直接联系，与构造函数没有直接联系。**



instanceof检查的是某对象的上有没有某原型存在。isPrototypeOf功能同上。



Object.getPrototypeOf()返回参数内部的[[Prototype]]的值。



Object.setPrototypeOf()可以重新设置参数1的原型为2。



然而上述设置原型的方法非常影响性能，建议使用Object.create()重新指定原型创建对象。



```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script>
        let Person = function(){
            Person.prototype.name = "我是构造函数的原型对象的name";
        };
        console.log(Person.prototype);
        // 返回原型对象的构造函数
        console.log(Person.prototype.constructor === Person);           // true
        // 构造函数的原型继承自Object的原型对象
        console.log(Person.prototype.__proto__ === Object.prototype);   // true
        console.log(Person.prototype.__proto__.constructor === Object); // true
        // Object的原型对象继承自null（typeof null == Object）
        console.log(Person.prototype.__proto__.__proto__ === null);     // true
        const person1 = new Person;
        const person2 = new Person;
        console.log(person1 === person2);                               // false
        console.log(person1.__proto__ === Person.prototype);            // true

        console.log(person1 instanceof Person);                         // true
        console.log(person1 instanceof Object);                         // true
        console.log(Person.prototype.isPrototypeOf(person1));           // true
        console.log(Object.prototype.isPrototypeOf(person1));           // true

        console.log(Object.getPrototypeOf(person1) === Person.prototype);// true

    </script>
</body>
</html>
```



```javascript
const Person = function() {};
Person.prototype.name = "这是Person原型的name";

const Dog = function() {};
Dog.prototype.name = "这是Dog原型的name";

const person1 = new Person();
console.log(person1.name);                      // 这是Person原型的name

Object.setPrototypeOf(person1, Dog.prototype);
console.log(person1.name);                      // 这是Dog原型的name

const dog = Object.create(Dog.prototype);
console.log(dog.name);                          // 这是Dog原型的name
```



##### 2.3.2 原型层级



在通过对象访问属性的时候，会按照这个属性的名称开始搜索。搜索开始于对象实例本身，如果在这个实例中找到，则返回该属性对应的值。如果没找到，则会进入对象的原型进行查找。



虽然通过实例可以读取原型的值，但不能重写这些值，只可以覆盖。即使将实例的值设置为null，也会覆盖原型内的值。



hasOwnProtopy()可以测试某属性到底是位于对象实例本身还是由对象继承自原型。如果是继承自本地则会返回true。



```javascript
const Person = function() {};
Person.prototype.name = "HYQ";
Person.prototype.age = 18;

const person1 = new Person();
person1.name = "LD";
const person2 = new Person();
console.log(person1.name);          // LD
console.log(person2.name);          // HYQ

console.log(person1.hasOwnProperty("name"));        // true 覆盖！
console.log(person2.hasOwnProperty("name"));        // false
```



##### 2.3.3 原型和in操作符



只要属性可以在对象及其原型链上访问到，则in操作符返回true。



配合hasOwnProperty()可以判断某属性是存在于对象实例还是原型。



而for-in会返回全部可枚举属性，包括实例属性和原型属性，返回一个字符串数组。



Object.keys()会返回对象自有的全部可迭代属性数组，Object.getOwnPropertyNames()会返回对象自有的全部属性数组，包括不可迭代。



```javascript
const Person = function() {};
Person.prototype.name = "这是Person构造函数的原型的name属性";
Person.prototype.age = "这是Person构造函数的原型的age属性";
Object.defineProperty(Person.prototype, "unEmu", {
    enumerable: false,
    value: "这是Person构造函数的原型的不可枚举属性",
});
for(const pe in Person.prototype) {
    console.log(Person.prototype[pe]);
};
// 这是Person构造函数的原型的name属性
// 这是Person构造函数的原型的age属性
const person1 = new Person();
person1.gender = "这是person1实例自有的gender属性";
Object.defineProperty(person1, "unEmu", {
    enumerable: false,
    value: "这是person1实例自有的不可枚举属性",
});
for(const pe in person1) {
    console.log(person1[pe]);
};
// 这是person1实例自由的gender属性
// 这是Person构造函数的原型的name属性
// 这是Person构造函数的原型的age属性

console.log(Object.keys(Person.prototype));
console.log(Object.getOwnPropertyNames(Person.prototype));

console.log(Object.keys(person1));
console.log(Object.getOwnPropertyNames(person1));
```



##### 2.3.4 属性枚举顺序



for-in、Object.keys()的枚举顺序不确定。



Object.getOwnPropertyNames()、Object.assign()的枚举顺序先是升序数字，后是升序首字母。



#### 2.4 对象迭代



Object.values()接收一个对象，返回其属性值的数组。



Object.entries()接收一个对象，返回其属性：属性值的键值对数组。



如果键为对象，则会进行浅复制。



符号属性会被忽略。



```javascript
const obj = {
    name: "HYQ",
    sons: {
        son1: "LD1",
        son2: "LD2",
    },
};
console.log(Object.keys(obj));
console.log(Object.values(obj));
console.log(Object.entries(obj));
// [ [ 'name', 'HYQ' ], [ 'sons', { son1: 'LD1', son2: 'LD2' } ] ]

// 浅复制
Object.values(obj)[1].son1 = "LDDDDDD";
console.log(Object.entries(obj));
// [ [ 'name', 'HYQ' ], [ 'sons', { son1: 'LDDDDDD', son2: 'LD2' } ] ]
```



##### 2.4.1 其他原型语法



为了减少代码冗余和更好封装原型，可以通过字面量来重写构造函数的原型。



代码段中，Person.prototype被重写为一个对象字面量创建的新对象。但是这样重写之后，Person.prototype的constructor便不再指向Person构造函数，而是指向Object构造函数。



```javascript
const Person = function() {};
Person.prototype = {
    name: "HYQ",
    age: 18,
};
console.log(Person.prototype.constructor);      // Function: Object
```



##### 2.4.2 原型的动态性



从原型上搜索值的过程是动态的，原型的变化实时反映在实例上。



但这个和重写Prototype是两码事。在实例创建时，[[prototype]]就已经赋值。但如果在创建实例完成后重写原型，那么实例依旧指向原先的原型。



```javascript
const Person = function() {};
Person.prototype.name = "这是Person原先的原型的name";
const p1 = new Person();
console.log(p1.name);
// 这是Person原先的原型的name

Person.prototype.name = "这是Person原先的原型的修改后的name";
console.log(p1.name);
// 这是Person原先的原型的修改后的name

Person.prototype = {
    name: "这是Person.prototype重写的原型的name",
};
console.log(p1.name);

// 这是Person原先的原型的修改后的name
```



##### 2.4.3 原生对象原型



原始模式是实现所有原生引用类型的模式，所有的原始引用类型的构造函数都在原型上定义的实例方法。



##### 2.4.4 原型的问题



原型弱化了向构造函数传参的能力，导致全部实例默认得到相同的属性值。属性上的全部属性都是共享的，这对函数来说是合适的，但对于引用值的属性，传递的是引用，一个实例的修改会引起原型的修改，进而改变其他实例的值。



```javascript
const Person = function() {};
Person.prototype = {
    friends: {
        f1: "HYQ",
        f2: "LD",
        f3: "NXY",
    },
};
const p1 = new Person();
const p2 = new Person();
console.log(p1.friends);
console.log(p2.friends);
// { f1: 'HYQ', f2: 'LD', f3: 'NXY' }
// { f1: 'HYQ', f2: 'LD', f3: 'NXY' }
p1.friends.f1 = "XZQ";
console.log(p1.friends);
console.log(p2.friends);
// { f1: 'XZQ', f2: 'LD', f3: 'NXY' }
// { f1: 'XZQ', f2: 'LD', f3: 'NXY' }
```



### 3 继承



很多面对对象语言支持两种继承：接口继承和实现继承。而JS只支持实现继承，主要通过原型链实现。



#### 3.1 原型链



每个构造函数都有一个原型对象，原型对象的一个属性指向constructor指回构造函数，而实例内部的__proto__属性指向原型。如果原型对象是另一个构造函数的实例，那么这个原型对象有一个__proto__属性指向另一个原型，另一个原型有一个constructor属性指向另一个构造函数。



```javascript
const Father = function() {
    this.property = "这是Father构造函数的property";
};
Father.prototype.getFatherProperty = function() {
    return this.property;
};
Father.prototype.get_son_PP = function() {
    return this.PP;
};

const Son = function() {
    this.property = "这是Son构造函数的property";
};
Son.prototype = new Father();
Son.prototype.getSonProperty = function() {
    return this.property;
};

const father = new Father();
const son = new Son();
son.PP = "这是son的PP属性值";
console.log(Object.entries(father));
console.log(Object.entries(son));
console.log(Object.getPrototypeOf(father) === Father.prototype);
console.log(Object.getPrototypeOf(son) === Son.prototype);
console.log(Object.getPrototypeOf(Son.prototype) === Father.prototype);
console.log(Father.prototype.constructor === Father);
console.log(Son.prototype.constructor === Father);

console.log(son.getSonProperty());
console.log(son.getFatherProperty());
console.log(son.get_son_PP());
```



实际上，原型链的最上层始终是Object，因此所有对象都继承了Object的方法，比如toString()…



原型与实例的关系可以使用instanceof和isPrototypeOf()来判断



以字面量定义原型会破坏原有的原型链，字面量定义的原型的原型对象始终是Object。



原型链有两个问题：



- 原型中的引用值会在全部子类型中共享。
- 子类型在实例化的时候无法向父类型的构造函数传参。



#### 3.2 盗用构造函数



基本思路：在子类构造函数中调用父类构造函数。因为函数就是在特定上下文中执行代码的简单对象，只需要用call/来指定函数的上下文即可。



相较于原型链，盗用构造函数最大的特点就是子类构造函数中向父类构造函数传递参数。



但它的缺点就是必须在构造函数中定义方法，函数不能重用。此外，子类也不能访问构造函数原型上的方法，所有类型都必须使用构造函数模式。



```javascript
const Father = function(name) {
    this.name = "这是Father的name属性";
    this.sayHi = function() {
        console.log(`Father 对${name}说你好`);
    };
};
Father.prototype.sayBye = function() {
    console.log("Good Bye");
};
const Son = function() {
    Father.call(this, "Jack");
    this.age = "这是Son的age属性";
};
const son1 = new Son();
son1.sayHi();
son1.sayBye();              //TypeError: son1.sayBye is not a function
```



#### 3.3 组合继承



组合继承使用原型链继承原型上的属性和方法，通过盗用构造函数继承实例属性。



```javascript
const Father = function(name) {
    this.name = "这是Father的name";
    this.hiName = name;
};
Father.prototype.sayHi = function() {
    console.log(`Father said: 'Hi, ${this.hiName}'`);
};

const Son = function(name) {
    // 继承属性
    Father.call(this, name);
    this.age = "这是Son的age";
};
// 继承方法
Son.prototype = new Father();

const son = new Son("Jack");
son.sayHi();
// Father said: 'Hi, Jack'
```



#### 3.4 原型式继承



通过Object.create()实现对象的继承。接收两个参数，第一个是对象，必选。第二个参数是额外添加的属性，可选。类似原型链，对于对象的引用都是浅复制。



```javascript
const Person = function() {
    // this.name = "HYQ";
};
Person.prototype.name = "111";
Person.prototype.sons = {
    s1: "ZYX",
    s2: "ML",
};
Person.prototype.sayHi = function() {
    console.log("Hi!");
};
const son = Object.create(Person.prototype);
// const son = Object.create(p1, {
//     friends: {
//         enumerable: true,
//         value: {
//             f1: "LD",
//             f2: "XZQ",
//         },
//     },
//     age: 18,
// });

console.log(son.name);
son.sons.s1 = "SCX";
console.log(Person.prototype.sons.s1);      // SCX
```



#### 3.5 寄生式继承



创建一个用于继承的函数，以某种方式增强对象，然后返回它。



```javascript
function createAnother(origin) {
    const clone = Object.create(origin);
    clone.sayHi = function() {
        console.log("Hi");
    };
    return clone;
};

const person = {
    name: "HYQ",
};

const son = createAnother(person);
son.sayHi();
```



#### 3.6 寄生式组合继承



基本思路：创建对象、增强对象、保护原型链、赋值对象



```javascript
const Father = function() {};
Father.prototype.name = "HYQ";

function inheritPrototype(subType, superType) {

    const prototype = Object.create(superType.prototype);
  
    prototype.sayHi = function() {
        console.log("Hi!");
    };
  
    prototype.constructor = subType;
    subType.prototype = prototype;
};

const Son = function() {};
inheritPrototype(Son, Father);
const son = new Son();
console.log(son.name);
son.sayHi();
// HYQ
// Hi!
```

---
> 原文链接: [【深入剖析JavaScript中的对象】](https://blog.csdn.net/m0_66681776/article/details/127935901?spm=1011.2415.3001.5331)
> 作者: Ari He
