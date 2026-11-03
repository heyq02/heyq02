---
title: Webpack 中 import 加载路径变量
description: 动态 import 路径在 Webpack 里为何打不进包，以及怎样留下静态目录和后缀让打包器收齐候选文件。
date: 2026-06-22
---

# Webpack 中 import 加载路径变量

::: tip {title="做完你会搞清楚什么"}
为什么「看起来像动态 import」的路径打包后找不到模块，以及怎样写 Webpack 才能在编译期把候选文件收进依赖图。
:::

::: info {title="适用场景"}
Webpack 项目里按配置动态加载主题、语言包等「目录固定、文件名可变」的资源。
:::

在 Webpack 项目里，如果 `import` 的路径完全由运行时变量拼出来，打包后往往会报「找不到模块」。本文记录一次从现象到原因的排查，以及 Webpack 实际支持的写法。

## 1. 问题与现象

业务里需要根据配置动态加载不同主题样式。若路径是**整段变量**，常见会写成：

```js
const themePath = `./theme/${theme}.less`
import(themePath)
```

本地开发或打包后访问时，资源加载失败：

![动态 import 加载失败的网络请求](https://i-blog.csdnimg.cn/img_convert/672424cb55db45d99322a0d1403b386c.png)

![控制台报找不到模块](https://i-blog.csdnimg.cn/img_convert/f86940fac5ee14e9ae7e5ddc98e2a337.png)

查看 Webpack 打包产物可以发现，`theme/bd-theme.less` **并没有被打进 bundle**：

![产物中缺少 theme 下的 less 文件](https://i-blog.csdnimg.cn/img_convert/a171c9ed9552ec7981fd96abf374cb69.png)

因此运行时找不到文件，其实是预期行为——打包阶段根本没有把它当作依赖收集进来。

## 2. 追溯原因

### import 是否支持路径变量？

![ES 模块动态 import 说明截图](https://i-blog.csdnimg.cn/img_convert/1a5151fa8ce961ea5b470d42ced88255.png)

从 ES 模块规范看，动态 `import()` 是支持的。但 **Webpack 在静态分析阶段只能处理「部分可推导」的路径**，并不会在运行时再去磁盘上扫目录。

Webpack 打包时会扫描源码里出现过的 `import` / `require` 路径，把能确定的文件加入依赖图。如果路径是纯变量，分析器在编译期无法知道最终会指向哪个文件，自然也就不会把对应资源打进产物：

```js
// 编译期无法推导具体文件，Webpack 不会打包任何 ./theme/*.less
const name = getThemeName()
import(`./theme/${name}.less`)
```

::: warning {title="注意"}
上面这段若写成「模板字符串直接出现在 `import()` 里」，Webpack 其实**可以**按目录 + 后缀做上下文收集。真正容易翻车的是：先赋给变量再 `import(variable)`，或路径里几乎没有任何静态片段。
:::

### 如何让 Webpack 识别路径变量？

对于「目录固定、文件名可变」这类场景，Webpack 会按类似正则的匹配规则提前收集候选文件。路径里需要保留**静态的目录前缀和文件后缀**，中间才放变量，并且把模板字符串**直接**写在 `import()` 里：

```js
// 目录 ./theme/ 与后缀 .less 是静态的，Webpack 会打包该目录下所有匹配的 .less
const theme = 'bd-theme'
import(`./theme/${theme}.less`)
```

![Webpack 识别静态前缀后的打包结果](https://i-blog.csdnimg.cn/img_convert/9651f25eadd8e566cea16428594a68f4.png)

对这个路径，Webpack 能推断出「可能要加载 `./theme/` 下的 `.less` 文件」，于是会把该目录下所有符合模式的文件一并打进 bundle，运行时再根据变量值取出对应模块。可以把它理解成一个**预加载缓冲区**：编译期把可能用到的文件都收进来，执行期再按实际路径命中。

如果目录层级也需要动态化，可以进一步收窄变量范围，或改用 `require.context` / `import.meta.glob`（Vite）等显式声明「要扫描哪些文件」的 API。

## 3. 小结

| 写法                                        | Webpack 能否打包 | 说明                            |
| ------------------------------------------- | ---------------- | ------------------------------- |
| `import(path)`，path 为纯变量               | 否               | 编译期无法推导具体文件          |
| ``import(`./dir/${name}.ext`)``             | 是               | 静态目录 + 静态后缀，中间为变量 |
| `require.context('./dir', false, /\.ext$/)` | 是               | 显式声明扫描范围                |

::: tip {title="核心原则"}
给打包器留一点静态信息。路径里至少要有固定的目录或后缀，并且模板要写在 `import()` 调用处，Webpack 才知道该把哪些文件纳入依赖图。
:::
