---
title: Python 进制转换 GUI（tkinter）
description: 用 tkinter 做一个可输入小数的二 / 八进制转换小工具，适合练手界面与进制算法。
date: 2023-02-26
---

# Python 进制转换 GUI（tkinter）

> [!NOTE] 你会得到什么
> 一个基于 Python 自带 tkinter 的进制转换窗口：输入数值与小数精度，输出二进制或八进制结果。

## 1. 简要介绍

程序功能很简单：根据输入的数值与精度，得到对应进制的转换结果。主要使用 Python 自带的 tkinter。

## 2. 分步详解

### 2.1 转化函数（二进制）

`Num` 为输入数字，`Time` 控制小数输出位数：

```python
def bin_Translate(Num, Time):
    # 得到 Num 的整数部分
    Num_Int = int(Num)
    # 临时存放值
    x = ''
    # 最终值
    finnal = ''
    # Num 整数部分为 0
    if Num_Int == 0:
        x = x + '0'
    # 除 2 取余
    while Num_Int > 0:
        x = x + str(Num_Int % 2)
        Num_Int = int(Num_Int / 2)
    # 逆向复制到 finnal
    total = len(x)
    while total >= 1:
        finnal = finnal + x[total - 1]
        total = total - 1
    # 小数部分
    Num_Ap = Num - int(Num)
    time = 1
    if Num_Ap != 0:
        finnal = finnal + '.'
        # 乘 2 取整
        while time <= Time:
            Num_Ap = Num_Ap * 2
            if Num_Ap >= 1:
                finnal = finnal + '1'
                Num_Ap = Num_Ap - 1
            else:
                finnal = finnal + '0'
            time = time + 1
    return finnal
```

### 2.2 界面设计

```python
root = Tk()
root.title('进制转换器')
root.geometry('400x300')
root.resizable(False, False)
var = StringVar()

label_1 = Label(root, text='请输入待转换的数值（可输入小数）')
entry_1 = Entry(root)

label_2 = Label(root, text='请输入转化后的进制（二进制与八进制可选）')
entry_2 = Entry(root)

label_3 = Label(root, text='请输入转化后的位数（对整数无效）')
entry_3 = Entry(root)

label = Label(root, textvariable=var, width=20, justify='left')

def show():
    E1 = float(entry_1.get())
    E2 = int(entry_2.get())
    E3 = int(entry_3.get())
    if E2 == 2:
        var.set(bin_Translate(E1, E3))
    elif E2 == 8:
        var.set(oct_Translate(E1, E3))
    else:
        var.set('进制错误')

button = Button(root, text='转换', command=show)

label_1.pack()
entry_1.pack()
label_2.pack()
entry_2.pack()
label_3.pack()
entry_3.pack()
button.pack()
label.pack()
Button(root, text='退出程序', command=root.quit).pack()
root.mainloop()
```

## 3. 最终代码

```python
from tkinter import *

def bin_Translate(Num, Time):
    Num_Int = int(Num)
    x = ''
    finnal = ''
    if Num_Int == 0:
        x = x + '0'
    while Num_Int > 0:
        x = x + str(Num_Int % 2)
        Num_Int = int(Num_Int / 2)
    total = len(x)
    while total >= 1:
        finnal = finnal + x[total - 1]
        total = total - 1
    Num_Ap = Num - int(Num)
    time = 1
    if Num_Ap != 0:
        finnal = finnal + '.'
        while time <= Time:
            Num_Ap = Num_Ap * 2
            if Num_Ap >= 1:
                finnal = finnal + '1'
                Num_Ap = Num_Ap - 1
            else:
                finnal = finnal + '0'
            time = time + 1
    return finnal


def oct_Translate(Num, Time):
    Num_Int = int(Num)
    x = ''
    finnal = ''
    if Num_Int == 0:
        x = x + '0'
    while Num_Int > 0:
        x = x + str(Num_Int % 8)
        Num_Int = int(Num_Int / 8)
    total = len(x)
    while total >= 1:
        finnal = finnal + x[total - 1]
        total = total - 1
    Num_Ap = Num - int(Num)
    time = 1
    if Num_Ap != 0:
        finnal = finnal + '.'
        while time <= Time:
            Num_Ap = Num_Ap * 8
            if Num_Ap >= 1:
                finnal = finnal + str(int(Num_Ap))
                Num_Ap = Num_Ap - int(Num_Ap)
            else:
                finnal = finnal + '0'
            time = time + 1
    return finnal

root = Tk()
root.title('进制转换器')
root.geometry('400x300')
root.resizable(False, False)
var = StringVar()

label_1 = Label(root, text='请输入待转换的数值（可输入小数）')
entry_1 = Entry(root)
label_2 = Label(root, text='请输入转化后的进制（二进制与八进制可选）')
entry_2 = Entry(root)
label_3 = Label(root, text='请输入转化后的位数（对整数无效）')
entry_3 = Entry(root)
label = Label(root, textvariable=var, width=20, justify='left')

def show():
    E1 = float(entry_1.get())
    E2 = int(entry_2.get())
    E3 = int(entry_3.get())
    if E2 == 2:
        var.set(bin_Translate(E1, E3))
    elif E2 == 8:
        var.set(oct_Translate(E1, E3))
    else:
        var.set('进制错误')

button = Button(root, text='转换', command=show)
label_1.pack()
entry_1.pack()
label_2.pack()
entry_2.pack()
label_3.pack()
entry_3.pack()
button.pack()
label.pack()
Button(root, text='退出程序', command=root.quit).pack()
root.mainloop()
```

## 4. 结语

若有疑问，欢迎私信或评论。
