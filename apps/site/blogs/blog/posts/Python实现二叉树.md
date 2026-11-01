---
title: Python 实现二叉树的基本操作
description: 用节点类和树类模拟链表，实现二叉树的创建、插入以及层次、先序、中序、后序遍历。
date: 2023-02-26
---

# Python实现二叉树的基本操作

```
包括树的创建，节点的插入，四种遍历（层次/先/中/后）
```

## 树的创建

```
通过构建两个类（节点类，数类）对链表进行模拟
```

```python
# 引入collections.deque()提高队列速度
# 全局变量res用于递归时提取数据
from collections import deque
res = deque()

# CLASS: 节点对象
class Node():

    # FUNCTION: 初始化叶子节点
    def __init__(self, value: int=0) -> None:
        self.val = value
        self.left, self.right = None, None
        pass

# CLASS: 二叉树对象
class Tree():

    # FUNCTION: 初始化根节点
    def __init__(self) -> None:
        self.root = None
        pass
```

**！！以下内容皆封装在Tree()类中**

## 判断树是否为空

```python
# FUNCTION: 空树判断
    def isEmpty(self) -> bool:
        if self.root == None:
            return True
        else:
            return False
        pass
```

## 插入单个（多个）节点

```python
# FUNCTION: 插入单个节点
    def addNode(self, value: int) -> None:

        # MODULE: 空树判断
        if self.isEmpty():
            self.root = Node(value)
            return

        # MODULE: 添加节点
        # 维护一个节点队列
        queue = deque()
        # 初始将根节点入队
        queue.append(self.root)
        while True:

            # 出队
            current = queue.popleft()

            # MODULE: 尝试加入左孩子
            if current.left == None:
                current.left = Node(value)
                break
            else:
                queue.append(current.left)

            # MODULE: 尝试加入右孩子
            if current.right == None:
                current.right = Node(value)
                break
            else:
                queue.append(current.right)
        pass

    # FUNCTION: 插入多个节点
    def addNodes(self, values: list) -> None:

        for value in values:
            self.addNode(value)
        pass

```

## 层次遍历

```python
# FUNCTION: 层次遍历
    def levelTravel(self) -> deque:

        # MODULE: 空树判断
        if self.isEmpty():
            return

        # MODULE: 遍历节点
        # 通过维护队列遍历到每一个节点
        res, queue = deque(), deque()
        # 初始化加入根节点
        queue.append(self.root)

        # 当节点队列为空时推出循环
        while queue:
            # 出队
            current = queue.popleft()
            # 将当前值加在res上
            res.append(current.val)
            if current.left != None:
                queue.append(current.left)
            if current.right != None:
                queue.append(current.right)

        return res
        pass
```

## 先序遍历

```python
# FUNCTION: 先序遍历
    def initialTravel(self) -> deque:

        global res

        def iniT(node) -> None:

            global res

            # MODULE: 递归终止
            if node == None:
                return

            # MODULE: 递归进行
            res.append(node.val)
            iniT(node.left)
            iniT(node.right)

        iniT(self.root)

        # MODULE: 清洗全局变量
        result = res
        res = deque()

        return result
        pass
```

## 中序遍历

```python
# FUNCTION: 中序遍历
    def middleTravel(self) -> deque:

        global res

        def midT(node) -> None:

            global res

            # MODULE: 递归终止
            if node == None:
                return

            # MODULE: 递归进行
            midT(node.left)
            res.append(node.val)
            midT(node.right)

        midT(self.root)

        # MODULE: 清洗全局变量
        result = res
        res = deque()

        return result
        pass

```

## 后序遍历

```python
# FUNCTION: 后序遍历
    def finalTravel(self) -> deque:

        global res

        def finT(node) -> None:

            global res

            # MODULE: 递归终止
            if node == None:
                return

            # MODULE: 递归进行
            finT(node.left)
            finT(node.right)
            res.append(node.val)

        finT(self.root)

        # MODULE: 清洗全局变量
        result = res
        res = deque()

        return result
        pass
```

## 测试

```python
if __name__ == "__main__":

    t = Tree()
    t.addNodes([0,3,6,2,4,2])

    print(t.levelTravel())
    print(t.initialTravel())
    print(t.middleTravel())
    print(t.finalTravel())
```
