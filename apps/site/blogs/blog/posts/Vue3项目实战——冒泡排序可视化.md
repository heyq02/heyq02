---
title: "Vue3项目实战——冒泡排序可视化"
author: "Ari He"
date: "于 2023-03-13 17:29:40 发布"
source: "https://blog.csdn.net/m0_66681776/article/details/129498533?spm=1011.2415.3001.5331"
---

- 本项目基于vite构建

 

- 使用vue3+ts作为前端框架，并加入了element-plus、echarts组件库

 

- 项目Github开源地址：[https://github.com/less-famous-ITer/data-structures-and-algorithms](https://github.com/less-famous-ITer/data-structures-and-algorithms)

 

- 行文逻辑是数据在页面间的流动，因此会在多个组件之间进行跳转讲解

 

- 博主参与了\`新星计划\`，希望读者能多多点赞关注，拜托拜托

 

1. 

## 整体架构


 
  
   
    ![](https://i-blog.csdnimg.cn/blog_migrate/1221a080ecf660926998ffafce4f8b8b.png)
   
  
 
 

1. \`App.vue\`会引用\`Bubble\`目录下的\`Index.vue\`作为项目入口

 

1. \`Index.vue\`接收\`nums\`输入，并将\`nums\`流入同目录下的\`Bubble.ts\`

 

1. \`Bubble.ts\`会对\`nums\`进行冒泡排序，并记录下过程数据

 

1. 过程数据流回\`Index.vue\`，经过预处理后传入\`BarChat\`的\`props\`进行柱状图的生成

 

1. \`Index.vue\`响应外界触发条件，结合步骤二的过程数据对传入\`BarChart\`的数据进行更新

 

1. 当排序完毕后不再响应触发条件更新视图，项目等同于结束

 

1. 

## Bubble.ts数据处理阶段


 

1. 新建一个响应式的\`nums\`变量

 

TIP：这里有一个点，必须要额外添加一个\`data\`作为中间对象。如果不使用\`data\`，那么nums会丢失传参的响应性，即传了-但没完全传，具体原因未知。

 

```typescript
let nums = reactive({
    data: [3, 4, 15, 4, 1, 9]
})
```

 

1. 引入Bubble.ts进行数据处理，并且新建一个\`process\`用来接收处理完毕的数据

 

```typescript
let process = reactive(Bubble(nums.data))
```

 

1. 记录冒泡排序过程数据。冒泡排序本身很简单，我们新建一个\`process\`二维数组，如果没有发生交换，则\`push\`一个长度为\`2\`的数组，分别代表着左下标与右下标。如果发生了交换，则\`push\`一个长度为\`3\`的数组作为区分。

 

```typescript
function Bubble(arr: number[]): number[][] {
 
    const process = []
 
    const nums = [...arr]
 
    for(let i = nums.length; i > 0; i--) {
        for(let j = 0; j + 1 < i; j++) {
 
            if(nums[j] > nums[j + 1]) {
 
                process.push([j, j + 1, 0])
 
                const temp = nums[j];
                nums[j] = nums[j + 1];
                nums[j + 1] = temp;
            } else {
                process.push([j, j + 1])
            }
        }
    }
 
    return process
}
```

 

1. 

## 初始柱状体生成阶段


 

1. \`Index.vue\`中引入组件\`BarChat\`，并传递\`nums\`和\`selected\`供其使用

 

```typescript
<BarChart :nums="nums.data" :selected="selected.data"/>
```

 

1. \`BarChat\`中调用echarts组件（统一的初始化过程）

 

```typescript
/**初始化设置`echarts` */
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent
} from 'echarts/components';
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
// 从上下文中引入echarts
const echarts = (getCurrentInstance() as ComponentInternalInstance).appContext.config.globalProperties.$echarts;
// 注册必须的组件
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    BarChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
]);
```

 

1. 定义\`Props\`接口并接收\`Index.vue\`传入的数据

 

```typescript
/** 设置props传参规则和默认值*/
let props = withDefaults(defineProps<{
    width: number,
    height: number,
    nums: number[],
    selected: number[]
}>(), {
    width: 500,
    height: 500
});
```

 

1. 动态生成\`x\`轴参数

 

```typescript
let i = 0;
const index = Array.from(
    new Array(props.nums.length), 
    () => String(i++)
);
```

 

1. 根据初始的\`nums\`生成柱状体

---
> 原文链接: [Vue3项目实战——冒泡排序可视化](https://blog.csdn.net/m0_66681776/article/details/129498533?spm=1011.2415.3001.5331)
> 作者: Ari He
