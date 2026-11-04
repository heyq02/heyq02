---
title: 趣味项目：2048 简单实现
date: 2024-03-08
---

# 趣味项目：2048 简单实现

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/fe891c3cfcf350678287a6921c506484.png)

## 算法原理

假设用一个二维矩阵表示 2048 页面，操作是左滑

```js
const matrix = [
  [2, 2, 4, 0],
  [0, 2, 4, 0],
  [0, 2, 2, 0],
  [2, 4, 4, 8]
]
```

- 将所有非空的数字向左移动

  ```js
  matrix = [
    [2, 2, 4, 0],
    [2, 4, 0, 0],
    [2, 2, 0, 0],
    [2, 4, 4, 8]
  ]
  ```

- 将相邻的相同数字合并

  ```js
  matrix = [
    [4, 0, 4, 0],
    [2, 4, 0, 0],
    [4, 0, 0, 0],
    [2, 8, 0, 8]
  ]
  ```

- 将所有非空的数字向左移动

  ```js
  matrix = [
    [4, 4, 0, 0],
    [2, 4, 0, 0],
    [4, 0, 0, 0],
    [2, 8, 8, 0]
  ]
  ```

- 将相邻的相同数字合并

  ```js
  matrix = [
    [8, 0, 0, 0],
    [2, 4, 0, 0],
    [4, 0, 0, 0],
    [2, 8, 8, 0]
  ]
  ```

- 将所有非空的数字向左移动

  ```js
  matrix = [
    [8, 0, 0, 0],
    [2, 4, 0, 0],
    [4, 0, 0, 0],
    [2, 8, 8, 0]
  ]
  ```

- 将相邻的相同数字合并

  ```js
  matrix = [
    [8, 0, 0, 0],
    [2, 4, 0, 0],
    [4, 0, 0, 0],
    [2, 16, 0, 0]
  ]
  ```

用 js 实现上述操作

```js
const moveLeft = matrix => {
  const moveLeftOnce = matrix => {
    const size = matrix.length

    // 第一步：将所有非零的数字向左移动
    for (let i = 0; i < size; i++) {
      let currentRow = matrix[i].filter(item => item !== 0)
      let zeroCount = size - currentRow.length
      matrix[i] = currentRow.concat(Array(zeroCount).fill(0))
    }
    // 第二步：将相邻的相同数字合并
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size - 1; j++) {
        if (matrix[i][j] === matrix[i][j + 1]) {
          matrix[i][j] *= 2
          matrix[i][j + 1] = 0
        }
      }
    }
  }

  // 记录上一步结束的矩阵
  let lastSMatrix = JSON.stringify(matrix)
  while (true) {
    moveLeftOnce(matrix)
    // 没有变化则操作完毕
    if (JSON.stringify(matrix) === lastSMatrix) {
      break
    }
    lastSMatrix = JSON.stringify(matrix)
  }
}
```

- 左滑
- 右滑: 翻转 -> 左滑 -> 翻转
- 上滑: 对角线翻折 -> 左滑 -> 对角线翻折
- 下滑: 对角线翻折 -> 右滑 -> 对角线翻折

## 实现思路

1. render 函数用于渲染外部容器和内部单元格
2. 通过 requestAnimationFrame 循环调用 render 函数
3. 添加键盘事件，借助复杂类型传参直接修改 matrix
4. render 函数根据 matrix 遍历渲染单元格
5. 键盘事件触发后检测是否结束

## 实现源码

仅为 JS 文件部分，其他文件及目录结构可在该仓库查看 [GitCode](https://gitcode.com/m0_66681776/2048/overview)

```js
// main.js
const moveLeft = matrix => {
  const moveLeftOnce = matrix => {
    const size = matrix.length

    // 第一步：将所有非零的数字向左移动
    for (let i = 0; i < size; i++) {
      let currentRow = matrix[i].filter(item => item !== 0)
      let zeroCount = size - currentRow.length
      matrix[i] = currentRow.concat(Array(zeroCount).fill(0))
    }
    // 第二步：将相邻的相同数字合并
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size - 1; j++) {
        if (matrix[i][j] === matrix[i][j + 1]) {
          matrix[i][j] *= 2
          matrix[i][j + 1] = 0
        }
      }
    }
  }

  let lastSMatrix = JSON.stringify(matrix)
  while (true) {
    moveLeftOnce(matrix)
    if (JSON.stringify(matrix) === lastSMatrix) {
      break
    }
    lastSMatrix = JSON.stringify(matrix)
  }
}

const moveRight = matrix => {
  const reverseMatrix = matrix => {
    const size = matrix.length
    for (let i = 0; i < size; i++) {
      matrix[i] = matrix[i].reverse()
    }
  }

  reverseMatrix(matrix)
  moveLeft(matrix)
  reverseMatrix(matrix)
}

const moveUp = matrix => {
  const transposeMatrix = matrix => {
    const size = matrix.length
    const newMatrix = Array.from({ length: size }, () => Array(size).fill(0))
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        newMatrix[i][j] = matrix[j][i]
      }
    }
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        matrix[i][j] = newMatrix[i][j]
      }
    }
  }

  transposeMatrix(matrix)
  moveLeft(matrix)
  transposeMatrix(matrix)
}

const moveDown = matrix => {
  const transposeMatrix = matrix => {
    const size = matrix.length
    const newMatrix = Array.from({ length: size }, () => Array(size).fill(0))
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        newMatrix[i][j] = matrix[j][i]
      }
    }
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        matrix[i][j] = newMatrix[i][j]
      }
    }
  }

  transposeMatrix(matrix)
  moveRight(matrix)
  transposeMatrix(matrix)
}

const main = () => {
  const color = {
    0: '#CCC0B3',
    2: '#EEE4DA',
    4: '#EDE0C8',
    8: '#F2B179',
    16: '#F49563',
    32: '#F5794D',
    64: '#F55D37',
    128: '#EEE863',
    256: '#EDB04D',
    512: '#ECB04D',
    1024: '#EB9437',
    2048: '#EA7821'
  }

  const matrix = [
    [2, 2, 4, 0, 4],
    [0, 2, 4, 0, 0],
    [0, 2, 2, 0, 16],
    [2, 4, 4, 8, 32],
    [2, 4, 4, 8, 32]
  ]

  /**
   * 绘制一个单元格
   * @param {string} color 颜色
   * @param {number} num 数字
   */
  const renderPixel = (color, num) => {
    const div = document.createElement('div')
    div.style.width = '100px'
    div.style.height = '100px'
    div.style.backgroundColor = color
    div.style.fontSize = '40px'
    div.style.textAlign = 'center'
    div.style.lineHeight = '100px'
    div.innerText = num
    return div
  }

  const size = matrix.length
  const app = document.getElementById('app')
  const render = matrix => {
    const container = document.createElement('div')
    container.style.display = 'grid'
    container.style.gridTemplateColumns = `repeat(${size}, 100px)`
    container.style.gridTemplateRows = `repeat(${size}, 100px)`
    container.style.width = `${size * 100}px`
    container.style.height = `${size * 100}px`
    container.style.border = '1px solid #000'
    container.style.borderRadius = '5px'
    container.style.margin = '100px auto'
    container.style.boxShadow = '0 0 10px #000'
    container.style.position = 'relative'
    container.style.overflow = 'hidden'
    container.style.backgroundColor = '#BBADA0'
    container.style.borderRadius = '5px'
    container.style.padding = '5px'
    container.style.boxSizing = 'border-box'
    container.style.transition = 'all 0.3s'
    container.style.userSelect = 'none'
    container.style.touchAction = 'none'
    container.style.cursor = 'pointer'
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const pixel = renderPixel(color[matrix[i][j]], matrix[i][j])
        container.appendChild(pixel)
      }
    }
    app.appendChild(container)
  }

  const update = matrix => {
    app.innerHTML = ''
    render(matrix)
    requestAnimationFrame(() => {
      update(matrix)
    })
  }
  requestAnimationFrame(() => {
    update(matrix)
  })

  document.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowLeft':
        moveLeft(matrix)
        break
      case 'ArrowRight':
        moveRight(matrix)
        break
      case 'ArrowUp':
        moveUp(matrix)
        break
      case 'ArrowDown':
        moveDown(matrix)
        break
    }

    const finishend = matrix.every(row => row.every(item => item !== 0))
    if (finishend) {
      alert('Game Over!')
    } else {
      const empty = []
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (matrix[i][j] === 0) {
            empty.push([i, j])
          }
        }
      }
      const random = empty[Math.floor(Math.random() * empty.length)]
      matrix[random[0]][random[1]] = Math.random() > 0.5 ? 2 : 4
    }
  })
}

window.onload = main
```
