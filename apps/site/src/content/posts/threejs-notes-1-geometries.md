---
title: Three.js 学习笔记（一）：几何体全家福
date: 2024-01-04
---

# Three.js 学习笔记（一）：几何体全家福

> [!NOTE] 来源
> 主要摘录自 [Three.js 官网](https://threejs.org/)，并补充了一些个人理解。

## 立方缓冲几何体

### 构造函数

| 参数名         | 含义          | 类型    | 默认值 |
| -------------- | ------------- | ------- | ------ |
| width          | X轴上面的宽度 | Float   | 1      |
| height         | Y轴上面的高度 | Float   | 1      |
| depth          | Z轴上面的深度 | Float   | 1      |
| widthSegments  | X轴的分段数   | Integer | 1      |
| heightSegments | Y轴的分段数   | Integer | 1      |
| depthSegments  | Z轴的分段数   | Integer | 1      |

### 示例代码

```javascript
const geometry = new THREE.BoxGeometry(6, 6, 6, 3, 2, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)
```

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/37a68032084c830624b34baed62bf7aa.png)

其中的*Segments就是指单个轴分成几份

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/600b1e67cda71a6ca21674bae7319dbf.png)

### 完整代码

参照官网，把three的npm包下载下来使用本地服务器向外暴露

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script type="importmap">
      {
        "imports": {
          "three": "http://localhost:3000/node_modules/three/build/three.module.min.js",
          "three/addons/": "http://localhost:3000/node_modules/three/examples/jsm/"
        }
      }
    </script>
  </head>
  <body>
    <script type="module">
      import * as THREE from 'three'
      import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )

      const renderer = new THREE.WebGLRenderer()
      renderer.setSize(window.innerWidth, window.innerHeight)
      document.body.appendChild(renderer.domElement)

      /** ========== 示范代码 ========== */
      const geometry = new THREE.BoxGeometry(6, 6, 6, 3, 2, 1)
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
      const cube = new THREE.Mesh(geometry, material)
      scene.add(cube)
      /** ============================= */

      const axesHelper = new THREE.AxesHelper(5)
      scene.add(axesHelper)

      const controls = new OrbitControls(camera, renderer.domElement)

      camera.position.z = 10
      controls.update()

      function animate() {
        requestAnimationFrame(animate)
        controls.update()
        renderer.render(scene, camera)
      }

      animate()
    </script>
  </body>
</html>
```

## 胶囊缓冲几何体

### 构造函数

| 参数名         | 含义                         | 类型    | 默认值 |
| -------------- | ---------------------------- | ------- | ------ |
| radius         | 胶囊半径                     | Float   | 1      |
| length         | 中间区域的长度               | Float   | 1      |
| capSegments    | 构造盖子的曲线部分的个数     | Integer | 4      |
| radialSegments | 覆盖胶囊圆周的分离的面的个数 | Integer | 8      |

### 示例代码

```javascript
const geometry = new THREE.CapsuleGeometry(3, 3, 5, 20)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
const capsule = new THREE.Mesh(geometry, material)
scene.add(capsule)
```

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/eceefa5ed6146a61d20798a8ef6f892b.png)

其中的capSegments是指从顶部看去的多边形边数

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/a521dae91f75ed0b914e8ba66addb513.png)

其中的radialSegments可以理解成构造单个面的密度

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/10d963b7375e16ff36fe0087587cd12e.png)

## 圆形缓冲几何体

### 构造函数

| 参数名      | 含义                 | 类型    | 默认值          |
| ----------- | -------------------- | ------- | --------------- |
| radius      | 圆形的半径           | Float   | 1               |
| segments    | 分段的数量           | Integer | 32（最小值为3） |
| thetaStart  | 第一个分段的起始角度 | Float   | 0               |
| thetaLength | 圆形扇区的中心角     | Float   | 2*PI            |

### 示范代码

```javascript
const geometry = new THREE.CircleGeometry(5, 10, 0, 2 * Math.PI)
const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true })
const circle = new THREE.Mesh(geometry, material)
scene.add(circle)
```

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/dcb187b0d8d7742a980a1601fbdff28d.png)

其中segments是指多边形的条数

其中thetaStart是指第一个分段与中间轴的偏移角度

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/ffa3c383cf181a583da2b5addefe2fa5.png)

其中thetaLength是指圆形总弧度

```javascript
const geometry = new THREE.CircleGeometry(5, 10, 30, 1.5 * Math.PI)
```

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/4cae66df3f14c718e71d4ee440ca4664.png)

## 圆锥缓冲几何体

### 构造函数

| 参数名         | 含义                       | 类型    | 默认值 |
| -------------- | -------------------------- | ------- | ------ |
| radius         | 圆锥底部半径               | Float   | 1      |
| height         | 圆锥的高度                 | Float   | 1      |
| radialSegments | 圆锥侧面周围的分段数       | Integer | 32     |
| heightSegments | 圆锥侧面沿着其高度的分段数 | Integer | 1      |
| openEnded      | 圆锥底面是否开放           | Boolean | false  |
| thetaStart     | 第一个分段的起始角度       | Float   | 0      |
| thetaLength    | 圆锥底面圆扇区的中心角     | Float   | 2 * PI |

### 示范代码

```javascript
const geometry = new THREE.ConeGeometry(5, 6, 8, 1, false, 0, 2 * Math.PI)
const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true })
const cone = new THREE.Mesh(geometry, material)
scene.add(cone)
```

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/a5cceabbc96cdf4bd3f1ede565329104.png)

其中radialSegments指顶部往下的多边形边数

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/eea53f67b6c1dd905957210ef9ab2671.png)

其中heightSegments是指y轴分段数

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/f8a6a030a054554f46721367ee6ec41b.png)

其中openEnded是指底部是否封闭

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/fe87f4f8da49cd1e508f69c452a63c02.png)

其中thetaStart是指初始模型与y轴偏移角度

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/ac6ea123b2420efcaaab276aeed9545b.png)

其中thetaLength是指圆锥弧度值

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/32ebc5bbffd9b6d4705915dbd1d0185f.png)

## 圆柱缓冲几何体

### 构造函数

| 参数名         | 含义                       | 类型    | 默认值 |
| -------------- | -------------------------- | ------- | ------ |
| radiusTop      | 圆柱的顶部半径             | Float   | 1      |
| radiusBottom   | 圆柱的底部半径             | Float   | 1      |
| height         | 圆柱的高度                 | Float   | 1      |
| radialSegments | 圆柱侧面周围的分段数       | Integer | 32     |
| heightSegments | 圆柱侧面沿着其高度的分段数 | Integer | 1      |
| openEnded      | 圆柱的底面是否开放         | Boolean | false  |
| thetaStart     | 第一个分段的起始角度       | Float   | 0      |
| thetaLength    | 圆柱底面圆扇区的中心角     | Float   | 2*PI   |

### 示范代码

```javascript
const geometry = new THREE.CylinderGeometry(3, 3, 8, 32, 1, false, 0, Math.PI * 2)
const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true })
const cylinder = new THREE.Mesh(geometry, material)
scene.add(cylinder)
```

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/4b0240dcb95cdc6ded4ea14fa6a0b842.png)

其中的各个参数都已在上文写过，可以参照圆形/圆锥，此处不再赘述

## 十二面缓冲几何体

### 构造函数

| 参数名 | 含义         | 类型    | 默认值 |
| ------ | ------------ | ------- | ------ |
| radius | 十二面体半径 | Float   | 1      |
| detail | 新增顶点     | Integer | 0      |

### 示范代码

```javascript
const geometry = new THREE.DodecahedronGeometry(2, 0)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)
```

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/c5aaca56980df1aa8078617aabcb3ca6.png)

## 边缘几何体

### 构造函数

| 参数名         | 含义         | 类型           | 默认值 |
| -------------- | ------------ | -------------- | ------ |
| geometry       | 几何体对象   | BufferGeometry | 无     |
| thresholdAngle | 边缘起始角度 | Integer        | 1      |

### 示范代码

```javascript
const geometry = new THREE.ConeGeometry(5, 6, 8, 2, false, 0, 2 * Math.PI)
const edges = new THREE.EdgesGeometry(geometry)
const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }))
scene.add(line)
```

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/e68c0b99865994392c6ede7c2ce762f8.png)

## 挤压缓冲几何体

### 构造函数

| 参数名         | 含义                             | 类型                         | 默认值 |
| -------------- | -------------------------------- | ---------------------------- | ------ |
| shape          | 形状或形状数组                   | Array                        | 无     |
| curveSegments  | 曲线上点的数量                   | Integer                      | 12     |
| steps          | 挤压线条的分段数                 | Integer                      | 1      |
| depth          | 挤出形状的深度                   | Float                        | 1      |
| bevelEnabled   | 是否应用斜角                     | Bool                         | true   |
| bevelThickness | 斜角的厚度                       | Float                        | 0.2    |
| bevelSize      | 斜角延伸距离                     | Float                        | 0.1    |
| bevelOffset    | 斜角与原始形状轮廓之间的延伸距离 | Float                        | 0      |
| bevelSegments  | Integer                          | 斜角的分段层数               | 3      |
| extrudePath    | THREE.Curve                      | 一条沿着被挤出形状的三维线条 | 无     |
| UVGenerator    | Object                           | UV生成器函数的对象           | 无     |

### 示范代码

```javascript
const length = 3,
  width = 2

const shape = new THREE.Shape()
shape.moveTo(0, 0)
shape.lineTo(0, width)
shape.lineTo(length, width)
shape.lineTo(length, 0)
shape.lineTo(0, 0)

const extrudeSettings = {
  curveSegments: 12,
  steps: 1,
  depth: 4,
  bevelEnabled: true,
  bevelThickness: 1,
  bevelSize: 1,
  bevelOffset: 0,
  bevelSegments: 3
}

const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
```

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/2f6b48ba27479d9686784e65704172be.png)

其中bevelThickness是指斜角与原来形状的垂直高度

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/79e440f75dad680c73cef3d2fd1f616b.png)

其中bevelSize是指斜角边的距离

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/f337c4d963321fd3b5bdef307c6ba5cb.png)

其中bevelOffset是指斜角与原来形状的偏移距离

```javascript
const length = 3,
  width = 2

const shape = new THREE.Shape()
shape.moveTo(0, 0)
shape.lineTo(0, width)
shape.lineTo(length, width)
shape.lineTo(length, 0)
shape.lineTo(0, 0)

const extrudeSettings = {
  curveSegments: 12,
  steps: 1,
  depth: 4,
  bevelEnabled: true,
  bevelThickness: 0.5,
  bevelSize: 2,
  bevelOffset: 1,
  bevelSegments: 3
}

const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const geometry2 = new THREE.BoxGeometry(3, 2, 0.1)
const material2 = new THREE.MeshBasicMaterial({ color: 0x11aa00 })
const cube = new THREE.Mesh(geometry2, material2)
cube.position.x = 1.5
cube.position.y = 1
cube.position.z = -0.5
scene.add(cube)
```

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/dab5fd5707beaea27aae9cb19adca3d9.png)

## 二十面缓冲几何体

### 构造函数

| 参数名 | 含义     | 类型    | 默认值 |
| ------ | -------- | ------- | ------ |
| radius | 半径     | Float   | 1      |
| detail | 新增顶点 | Integer | 0      |

### 示范代码

```javascript
const dodecahedron = new THREE.DodecahedronGeometry(5, 0)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
const cube = new THREE.Mesh(dodecahedron, material)
scene.add(cube)
```

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/d13e02de349ccdd46899727b272569f3.png)

## 车削缓冲几何体

### 构造函数

| 参数名    | 含义               | 类型    | 默认值                          |
| --------- | ------------------ | ------- | ------------------------------- |
| points    | 二维点数组         | Array   | [(0, -0.5), (0.5, 0), (0, 0.5)] |
| segments  | 生成的圆周分段数   | Integer | 12                              |
| phiStart  | 弧度表示的起始角度 | Float   | 0                               |
| phiLength | 车削弧度           | Float   | 2*PI                            |

### 示范代码

```javascript
const points = []
for (let i = 0; i < 10; i++) {
  points.push(new THREE.Vector2(Math.sin(i * 0.2) * 1 + 5, i - 5))
}
const geometry = new THREE.LatheGeometry(points)
const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true })
const lathe = new THREE.Mesh(geometry, material)
scene.add(lathe)
```

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/95130fd7becefa13f529ca61c8da4514.png)

其中segments是指从上向下的多边形边数

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/f310303ec78dab6d81822f0962982bf2.png)

其中phiStart是指起始角度

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/a6bd4d87cbadcdb23fee06416b0c49fe.png)

其中phiLength是指车削的弧度

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/aa7851dfc91e40fc83fec6fad0e60bc7.png)

## 八面缓冲几何体

### 构造函数

| 参数名 | 含义       | 类型    | 默认值 |
| ------ | ---------- | ------- | ------ |
| radius | 八面体半径 | Float   | 1      |
| detail | 新增顶点   | Integer | 0      |

### 示范代码

```javascript
const geometry = new THREE.OctahedronGeometry(2)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)
```

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/d96759c8f6f6e89e36d227e8297adfb3.png)

## 平面缓冲几何体

### 构造函数

| 参数名         | 含义          | 类型    | 默认值 |
| -------------- | ------------- | ------- | ------ |
| width          | X轴上面的宽度 | Float   | 1      |
| height         | Y轴上面的高度 | Float   | 1      |
| widthSegments  | X轴的分段数   | Integer | 1      |
| heightSegments | Y轴的分段数   | Integer | 1      |

### 示范代码

```javascript
const geometry = new THREE.PlaneGeometry(1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide })
const plane = new THREE.Mesh(geometry, material)
scene.add(plane)
```

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/4b9e69360ed8ada93273cd5a8336479c.png)

## 多面缓冲几何体

暂未搞懂

```
多面体在三维空间中具有一些平面的立体图形。这个类将一个顶点数组投射到一个球面上，之后将它们细分为所需的细节级别。 这个类由DodecahedronGeometry、IcosahedronGeometry、OctahedronGeometry和TetrahedronGeometry 所使用，以生成它们各自的几何结构。
```

## 圆环缓冲几何体-2D

### 构造函数

| 参数名        | 含义           | 类型    | 默认值 |
| ------------- | -------------- | ------- | ------ |
| innerRadius   | 内部半径       | Float   | 0.5    |
| outerRadius   | 外部半径       | Float   | 1      |
| thetaSegments | 圆环分段数     | Integer | 32     |
| phiSegments   | 圆环半径分段数 | Integer | 8      |
| thetaStart    | 起始角度       | Float   | 0      |
| thetaLength   | 圆心角         | Float   | 2*PI   |

### 示范代码

```javascript
const geometry = new THREE.ConeGeometry(5, 6, 8, 2, false, 0, 2 * Math.PI)
const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true })
const cone = new THREE.Mesh(geometry, material)
scene.add(cone)
```

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/79784585302c4c401a77e9a1325f79ba.png)

## 形状缓冲几何体

### 构造函数

| 参数名        | 含义                     | 类型    | 默认值     |
| ------------- | ------------------------ | ------- | ---------- |
| shape         | 单独的shape或者shape数组 | Array   | 一个三角形 |
| curveSegments | 每个形状的分段数         | Integer | 12         |

### 示范代码

```javascript
const x = 0,
  y = 0

const heartShape = new THREE.Shape()

heartShape.moveTo(x + 5, y + 5)
heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y)
heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7)
heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19)
heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7)
heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y)
heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5)

const geometry = new THREE.ShapeGeometry(heartShape)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
```

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/bea8e990fd6397c1696020d608bca99d.png)

## 球缓冲几何体

### 构造函数

| 参数名         | 含义         | 类型    | 默认值 |
| -------------- | ------------ | ------- | ------ |
| radius         | 球体半径     | Float   | 1      |
| widthSegments  | 经线分段数   | Integer | 32     |
| heightSegments | 纬线的分段数 | Integer | 16     |
| phiStart       | 经线起始角度 | Float   | 0      |
| phiLength      | 经线扫描角度 | Float   | 2*PI   |
| thetaStart     | 纬线起始角度 | Float   | 0      |
| thetaLength    | 纬线扫描角度 | Float   | 2*PI   |

### 示范代码

```javascript
const geometry = new THREE.SphereGeometry(5, 32, 16, 0, 1.5 * Math.PI, 0, 0.5 * Math.PI)
const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true })
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)
```

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/bfca87bc596ffbffc5aae4682aad8151.png)

## 四面缓冲几何体

### 构造函数

| 参数名 | 含义       | 类型    | 默认值 |
| ------ | ---------- | ------- | ------ |
| radius | 四面体半径 | Float   | 1      |
| detail | 新增顶点   | Integer | 0      |

### 示范代码

```javascript
const geometry = new THREE.TetrahedronGeometry(6, 0)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)
```

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/2693fe522db562575e1935cdce400e72.png)

## 圆环缓冲几何体-3D

### 构造函数

| 参数名          | 含义               | 类型    | 默认值 |
| --------------- | ------------------ | ------- | ------ |
| radius          | 环面的半径         | Float   | 1      |
| tube            | 管道的半径         | Float   | 0.4    |
| radialSegments  | 管道横截面的分段数 | Integer | 12     |
| tubularSegments | 管道的分段数       | Integer | 48     |
| arc             | 圆环圆心角         | Float   | 2*PI   |

### 示范代码

```javascript
const geometry = new THREE.TorusGeometry(2, 1, 5, 10)
const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true })
const torus = new THREE.Mesh(geometry, material)
scene.add(torus)
```

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/9a6d1e6cf79482ab2876d36d91d66ce8.png)

其中radialSegments是指正面看的分段数

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/7bf4849f96cd3331e6acc7017703b971.png)

其中tubularSegments是指擦面看的分段数

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/d882ec2e23b3b7615ac55a64e87edb82.png)

## 圆环缓冲扭结几何体

### 构造函数

| 参数名          | 含义                       | 类型    | 默认值 |
| --------------- | -------------------------- | ------- | ------ |
| radius          | 圆环半径                   | Float   | 1      |
| tube            | 管道的半径                 | Float   | 0.4    |
| tubularSegments | 管道的分段数量             | Integer | 64     |
| radialSegments  | 横截面的分段数量           | Integer | 8      |
| p               | 几何体围绕对称轴旋转周数   | Integer | 2      |
| q               | 几何体围绕内部圆环旋转周数 | Integer | 3      |

### 示范代码

```javascript
const geometry = new THREE.TorusKnotGeometry(1, 0.5, 100, 16)
const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true })
const torusKnot = new THREE.Mesh(geometry, material)
scene.add(torusKnot)
```

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/2b61f322496eb5c1aab2c592833b30d2.png)

## 管道缓冲几何体

### 构造函数

| 参数名          | 含义             | 类型    | 默认值                   |
| --------------- | ---------------- | ------- | ------------------------ |
| path            | 3D路径           | Curve   | a quadratic bezier curve |
| tubularSegments | 管道分段数       | Integer | 64                       |
| radius          | 管道的半径       | Float   | 1                        |
| radialSegments  | 管道横截面分段数 | Integer | 8                        |
| closed          | 管道是否闭合     | Bool    | false                    |

### 示范代码

```javascript
class CustomSinCurve extends THREE.Curve {
  constructor(scale = 1) {
    super()

    this.scale = scale
  }

  getPoint(t, optionalTarget = new THREE.Vector3()) {
    const tx = t * 3 - 1.5
    const ty = Math.sin(2 * Math.PI * t)
    const tz = 0

    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale)
  }
}

const path = new CustomSinCurve(10)
const geometry = new THREE.TubeGeometry(path, 20, 2, 8, false)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
```

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/a2cd80c7d4f1ab7bd5d50fe8947a9740.png)

## 网格几何体

### 构造函数

| 参数名   | 含义           | 类型           | 默认值 |
| -------- | -------------- | -------------- | ------ |
| geometry | 任意几何体对象 | ButterGeometry | 无     |

### 示范代码

```js
const geometry = new THREE.SphereGeometry(5, 5, 5)

const wireframe = new THREE.WireframeGeometry(geometry)

const line = new THREE.LineSegments(wireframe)
line.material.depthTest = false
line.material.opacity = 0.25
line.material.transparent = true

scene.add(line)
```

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/0f35c2a807d198b9830d6568bf562034.png)
