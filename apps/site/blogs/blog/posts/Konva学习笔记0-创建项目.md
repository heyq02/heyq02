---
title: "Konva学习笔记0-创建项目"
author: "Ari He"
date: "于 2023-08-25 10:54:56 发布"
source: "https://blog.csdn.net/m0_66681776/article/details/132490884?spm=1011.2415.3001.5331"
---

## Konva学习笔记0-创建



### 安装



```shell
npm i webpack webpack-cli -g
```



### 新建项目文件夹



```shell
mkdir demo
cd demo
```



### 安装辅助框架



```shell
webpack-cli init
```



此时会提醒是否安装xx包，输入y+enter即可开始安装

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/b93df6a43084c3b820d3fad04fc91c71.png)



### 再次初始化项目



![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/7c9d254ef590f02911ecd2398a822d4b.png)



安装完毕会报错，不理它，再次初始化



```shell
webpack-cli init
```



### 设置项目选项



脚手架提供了一系列初始化选择，提供博主个人的选择，凭自主喜好即可

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/207957f9e8f5e9a283ce4dd25266620a.png)K



### 安装并配置Konva



```shell
npm i konva
```



编辑tsconfig.，在compilerOptions节点中添加lib和moduleResolution



```json
{
    "compilerOptions": {
        "allowSyntheticDefaultImports": true,
        "noImplicitAny": true,
        "module": "es6",
        "target": "es5",
        "allowJs": true,
        "lib": [ "es6", "dom" ],
        "moduleResolution": "node"
    }
}
```



### 测试Demo



修改index.



```html
<!DOCTYPE html>
<html>
 <head>
     <meta charset="utf-8" />
     <title>Webpack App</title>
 </head>
 <body>
     <div id="container"></div>
 </body>
</html>
```



修改src/index.ts



```ts
import Konva from "konva";

const width = window.innerWidth;
const height = window.innerHeight;

const stage = new Konva.Stage({
   container: 'container',
   width: width,
   height: height
});

const layer = new Konva.Layer();

const rect1 = new Konva.Rect({
   x: 20,
   y: 20,
   width: 100,
   height: 50,
   fill: 'green',
   stroke: 'black',
   strokeWidth: 4
});
// add the shape to the layer
layer.add(rect1);

const rect2 = new Konva.Rect({
   x: 150,
   y: 40,
   width: 100,
   height: 50,
   fill: 'red',
   shadowBlur: 10,
   cornerRadius: 10
});
layer.add(rect2);

const rect3 = new Konva.Rect({
   x: 50,
   y: 120,
   width: 100,
   height: 100,
   fill: 'blue',
   cornerRadius: [0, 10, 20, 30]
});
layer.add(rect3);

// add the layer to the stage
stage.add(layer);
```



最后运行



```shell
npm run serve
```



可以在输入地址 ://localhost:8080/ 看到最终结果

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/304f7ac2cfbc40a258cec915a5618a23.png)

---
> 原文链接: [Konva学习笔记0-创建项目](https://blog.csdn.net/m0_66681776/article/details/132490884?spm=1011.2415.3001.5331)
> 作者: Ari He
