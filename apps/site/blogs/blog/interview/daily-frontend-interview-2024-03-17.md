---
title: 每日前端面经 · 2024-03-17
date: 2024-03-17
---

# 【每日前端面经】2024-03-17

## 本期重点 —— Promise

欢迎订阅我的前端面经专栏：[每日前端面经](https://blog.csdn.net/m0_66681776/category_12583217.html?spm=1001.2014.3001.5482)

```txt
Tips:

每日面经更新从 2-22 到 3-15 已有 23 篇，最近愈发觉得内容相似度高，并且理解程度不深
于是临时停更面经，并将这些面经中的重难点以项目实战的方式展现出来供读者参阅

本期项目地址：https://github.com/xxhls/02-write-promise
```

在线预览：[02-write-promise](https://xxhls.github.io/02-write-promise/)

### 产生背景

在 Promise 出现前，对于多个异步请求，往往会产生回调地狱

```js
const fs = require('fs')

fs.readFile('./name.txt', 'utf-8', (err, data) => {
  fs.readFile(data, 'utf-8', (err, data) => {
    fs.readFile(data, 'utf-8', (err, data) => {
      console.log(data)
    })
  })
})
```

通过 Promise 可以有效解决以上问题

```js
const fs = require('fs')

new Promise((resolve, reject) => {
  fs.readFile('./name.txt', 'utf-8', (err, data) => {
    if (err) reject(err)
    resolve(data)
  })
    .then(data => {
      return new Promise(resolve => {
        fs.readFile(data, 'utf-8', (err, data) => {
          resolve(data)
        })
      })
    })
    .then(data => {
      return new Promise(resolve => {
        fs.readFile(data, 'utf-8', (err, data) => {
          resolve(data)
        })
      })
    })
})
```

### 相关 API

#### Promise.all()

接受一个 Promise 可迭代对象作为输入，并返回一个 Promise。当所有输入的 Promise 都被兑现时，返回的 Promise 也将被兑现，并返回一个包含所有兑现值的数组。如果输入的任何 Promise 被拒绝，则返回的 Promise 将被拒绝，并带有第一个被拒绝的原因

##### 示例

```js
const promise1 = Promise.resolve(3)
const promise2 = Promise.resolve(4)
const promise3 = new Promise((resolve, reject) => setTimeout(resolve, 100, 'foo'))

Promise.all([promise1, promise2, promise3]).then(values => console.log(values))

// [3, 4, 'foo']
```

```js
const promise1 = Promise.resolve(3)
const promise2 = Promise.reject(4)
const promise3 = new Promise((resolve, reject) => setTimeout(resolve, 100, 'foo'))

Promise.all([promise1, promise2, promise3])
  .then(values => console.log(values))
  .cache(reason => console.log(reason))

// 4
```

##### 手写

```js
function PromiseAll(promises: Array<Promise>) {
    // 总共 Promise 的个数
    const total = promises.length;
    // 完成的 Promise 的个数
    let i = 0;
    // 存储 Resolve 结果
    const result = [];

    return new Promise((resolve, reject) => {
        // 逐一添加处理函数
        promises.forEach((promise) => {
            promise
                .then((data) => {
                    // 完成的 Promise 的个数加一
                    i++;
                    // Resolve 结果推入 result 中
                    result.push(data);
                    // 如果全部 Promise 都完成，就 Resolve 结果数组
                    if (i === total) resolve(result);
                })
                .catch((reason) => {
                    // 有一个 Promise 被拒绝直接 Reject 该原因
                    reject(reason);
                });
        });
    });
}
```

#### Promise.allSettled()

将一个 Promise 可迭代对象作为输入，并返回一个单独的 Promise。当所有输入的 Promise 都已敲定时（包括传入空的可迭代对象时），返回的 Promise 将被兑现，并带有描述每个 Promise 结果的对象数组

##### 示例

```js
const promise1 = Promise.resolve(3)
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'))
const promises = [promise1, promise2]

Promise.allSettled(promises).then(results => results.forEach(result => console.log(result.status)))

// "fulfilled"
// "rejected"
```

##### 手写

```js
function PromiseAllSettled(promises: Array<Promise>) {
    // 总共 Promise 的个数
    const total = promises.length;
    // 完成的 Promise 的个数
    let i = 0;
    // 存储结果
    const result = [];

    return new Promise((resolve, reject) => {
        // 逐一添加处理函数
        promises.forEach((promise) => {
            promise
                .then((data) => {
                    // 完成的 Promise 的个数加一
                    i++;
                    // Resolve 结果推入 result 中
                    result.push("fulfilled");
                    // 如果全部 Promise 都完成，就 Resolve 结果数组
                    if (i === total) resolve(result);
                })
                .catch((reason) => {
                    // 完成的 Promise 的个数加一
                    i++;
                    // Resolve 结果推入 result 中
                    result.push("rejected");
                    // 如果全部 Promise 都完成，就 Resolve 结果数组
                    if (i === total) resolve(result);
                });
        });
    });
}
```

#### Promise.any()

将一个 Promise 可迭代对象作为输入，并返回一个 Promise。当输入的任何一个 Promise 兑现时，这个返回的 Promise 将会兑现，并返回第一个兑现的值。当所有输入 Promise 都被拒绝（包括传递了空的可迭代对象）时，它会以一个包含拒绝原因数组的 AggregateError 拒绝

##### 示例

```js
const promise1 = Promise.reject(0)
const promise2 = new Promise(resolve => setTimeout(resolve, 100, 'quick'))
const promise3 = new Promise(resolve => setTimeout(resolve, 500, 'slow'))

const promises = [promise1, promise2, promise3]

Promise.any(promises).then(value => console.log(value))

// "quick"
```

```js
const promise1 = Promise.reject(0)
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'quick'))
const promise3 = new Promise((resolve, reject) => setTimeout(reject, 500, 'slow'))

const promises = [promise1, promise2, promise3]

Promise.any(promises).catch(reasons => console.log(reasons))

// [0, "quick", "slow"]
```

##### 手写

```js
function PromiseAny(promises: Array<Promise>) {
    // 总共 Promise 的个数
    const total = promises.length;
    // 完成的 Promise 的个数
    let i = 0;
    // 存储拒绝结果
    const reasons = [];

    return new Promise((resolve, reject) => {
        // 逐一添加处理函数
        promises.forEach((promise) => {
            promise
                .then((data) => {
                    // 如果一个 Promise 完成，就 Resolve 数据
                    resolve(data);
                })
                .catch((reason) => {
                    // 拒绝的 Promise 的个数加一
                    i++;
                    // Reject 结果推入 reasons 中
                    reasons.push(reason);
                    // 如果全部 Promise 都拒绝，就 Reject 结果数组
                    if (i === total) reject(reasons);
                });
        });
    });
}
```

#### Promise.prototype.catch()

用于注册一个在 promise 被拒绝时调用的函数。它会立即返回一个等效的 Promise 对象，这可以允许你链式调用其他 promise 的方法

```js
const promise1 = new Promise((resolve, reject) => {
  throw new Error('Uh-oh!')
})

promise1.catch(error => {
  console.error(error)
})
// Error: Uh-oh!
```

#### Promise.prototype.finally()

Promise 实例的 finally() 方法用于注册一个在 promise 敲定（兑现或拒绝）时调用的函数。它会立即返回一个等效的 Promise 对象，这可以允许你链式调用其他 promise 方法

```js
function checkMail() {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0.5) {
      resolve('Mail has arrived')
    } else {
      reject(new Error('Failed to arrive'))
    }
  })
}

checkMail()
  .then(mail => {
    console.log(mail)
  })
  .catch(err => {
    console.error(err)
  })
  .finally(() => {
    console.log('Experiment completed')
  })
```

#### Promise.race()

接受一个 promise 可迭代对象作为输入，并返回一个 Promise。这个返回的 promise 会随着第一个 promise 的敲定而敲定

##### 示例

```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'one')
})

const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'two')
})

Promise.race([promise1, promise2]).then(value => {
  console.log(value)
  // Both resolve, but promise2 is faster
})
// Expected output: "two"
```

##### 手写

```js
function PromiseRace(promises: Array<Promise>) {

    return new Promise((resolve, reject) => {
        // 逐一添加处理函数
        promises.forEach((promise) => {
            promise
                .then((data) => {
                    // 如果一个 Promise 完成，就 Resolve 数据
                    resolve(data);
                })
                .catch((reason) => {
                    // 如果一个 Promise 完成，就 Reject 数据
                    reject(data);
                });
        });
    });
}
```

#### Promise.reject()

返回一个已拒绝（rejected）的 Promise 对象，拒绝原因为给定的参数

```js
function resolved(result) {
  console.log('Resolved')
}

function rejected(result) {
  console.error(result)
}

Promise.reject(new Error('fail')).then(resolved, rejected)
// Expected output: Error: fail
```

#### Promise.resolve()

将给定的值转换为一个 Promise。如果该值本身就是一个 Promise，那么该 Promise 将被返回；如果该值是一个 thenable 对象，Promise.resolve() 将调用其 then() 方法及其两个回调函数；否则，返回的 Promise 将会以该值兑现

该函数将嵌套的类 Promise 对象（例如，一个将被兑现为另一个 Promise 对象的 Promise 对象）展平，转化为单个 Promise 对象，其兑现值为一个非 thenable 值

```js
const promise1 = Promise.resolve(123)

promise1.then(value => {
  console.log(value)
  // Expected output: 123
})
```

#### Promise.prototype.then()

最多接受两个参数：用于 Promise 兑现和拒绝情况的回调函数。它立即返回一个等效的 Promise 对象，允许你链接到其他 Promise 方法，从而实现链式调用

```js
const promise1 = new Promise((resolve, reject) => {
  resolve('Success!')
})

promise1.then(value => {
  console.log(value)
  // Expected output: "Success!"
})
```

### 手写 Promise

```js
const PENDING = Symbol('PENDING');
const FULLFILLED = Symbol('FULLFILLED');
const REJECTED = Symbol('REJECTED');

enum Status {
    PENDING,
    FULLFILLED,
    REJECTED
}

type Executor = (resolve: (value: any) => void, reject: (reason: any) => void) => void;

class MyPromise {
    status: Status;
    data: any;
    reason: any;

    onResolvedCallbacks: Function[];
    onRejectedCallbacks: Function[];

    constructor(executor: Executor) {
        this.status = Status.PENDING;
        this.data = null;
        this.reason = null;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];

        const resolve = (data: any) => {
            console.log('resolve');
            if (this.status === Status.PENDING) {
                this.status = Status.FULLFILLED;
                this.data = data;
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        };

        const reject = (reason: any) => {
            console.log('reject');
            if (this.status === Status.PENDING) {
                this.status = Status.REJECTED;
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        };

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFullfilled: (value: any) => any, onRejected: (reason: any) => any) {
        if (this.status === Status.FULLFILLED) {
            onFullfilled(this.data);
        } else if (this.status === Status.REJECTED) {
            onRejected(this.reason);
        } else if (this.status === Status.PENDING) {
            this.onResolvedCallbacks.push(() => {
                onFullfilled(this.data);
            });
            this.onRejectedCallbacks.push(() => {
                onRejected(this.reason);
            });
        }
    }
}

console.log("测试 MyPromise");
new MyPromise((resolve, reject) => {
    setTimeout(() => {
        console.log('执行完成');
        resolve('success');
    }, 1000);
}).then((data) => {
    console.log('回调成功');
    console.log(data);
}, (reason) => {
    console.log(reason);
});

new MyPromise((resolve, reject) => {
    setTimeout(() => {
        console.log('执行完成');
        reject('failure');
    }, 1000);
}).then((data) => {
    console.log('回调成功');
    console.log(data);
}, (reason) => {
    console.log('回调成功');
    console.log(reason);
});

export default MyPromise;
```
