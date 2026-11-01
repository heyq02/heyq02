---
title: "Python实例: 实现循环冗余校验码的编码"
author: "Ari He"
date: "于 2023-02-26 07:01:58 发布"
source: "https://blog.csdn.net/m0_66681776/article/details/123385022?spm=1011.2415.3001.5331"
---

>  
>  这里不再赘述循环冗余校验码的编码方式，直接进入编程。为了便于使用，博主在其中添加了根据tkinter模块编写的GUI界面辅助。全部代码在文末 
> 
 


**目录**
 


[一、根据生成多项式得到生成编码](#t0)
 


[二、延长初始序列](#t1)
 


[三、同位序列异或运算](#t2)
 


[四、循环补项取余](#t3)
 


[五、书上例题与样图](#t4)
 


[六、全部代码](#t5)
 


[七、结语](#t6)
 


---




 


## 一、根据生成得到生成编码
 


我们以x^4+x^1+1为例：
 


int(s[2])+1获取生成码的最终位数（4+1=5）
 


p=s[2::4]获取每一个x的幂数（41）
 


我们先用digit-1隔绝最后一位，这里使用s.(x)查找digit-i-1是否在p内，举个简单的例子，上述的多项式最终编码是五位，其中第一位，第四位要变成1，其他位都是0，读者可以思考一下为什么这样可以实现该操作
 


对于最后一位，有三种可能：x^2+1、x^2+x^1、x^1+1。为了判断是哪一种，我们截取最后的片段来与x^1比较，再决定是否在最后加1
 


```python
# 根据生成多项式获取生成码
def get_generate_code(s):
    digit = int(s[2]) + 1
    i = 0
    GC = ""
    p = s[2::4]
    while i < digit - 1:
        if p.find(str(digit - i - 1)) == -1:
            GC += "0"
        else:
            GC += "1"
        i += 1
    if s[-1:-3] == "x^1":
        GC += "0"
    else:
        GC += "1"
    return GC
```
 


## 二、延长初始序列
 


这个很简单，上面的生成码有n位，就在原比特序列后面加n-1个0
 


```python
# 延长初始序列
def length(m, n):
    p = m
    i = 1
    while i <= len(n) - 1:
        p += "0"
        i += 1
    return p
```
 


## 三、同位序列异或运算
 


我们都知道，要想得到CRC码需要找到余数，而这里我把单独一次的除法运算与循环用函数分割开来
 


是监测因子。在计算是，不可能余数由0开头，因此我们设置只用当遇见非0check才会变1，而初始值是0。只有当check不为0时才会向余数序列添加0，有点妙~
 


```python
# 计算P异或Q并返回余数
def compare(p, q):
    m = ""
    check = 0
    for i in range(0, len(q), 1):
        if p[i] == q[i]:
            if check != 0:
                m += "0"
        else:
            m += "1"
            check = 1
 
    return m
```
 


## 四、循环补项取余
 


我们知道，每次取余后余数的位数很可能小于生成码位数，这是就需要从原序列中补项。我们使用index控制取余补项的进行与停止。
 


m_front是用于获取第一次进行取余的序列
 


在最后，index=len(m)退出补项取余行为，但是如果余数与生成码的位数相同，任需要进行最后一次取余行为
 


```python
def get_CRC(m, n):
    index = len(n)
    m_front = m[0: index]
    remainder = compare(m_front, n)
    while True:
        if index < len(m):
            while len(remainder) < len(n):
                if index == len(m):
                    break
                remainder += m[index]
                index += 1
            if len(remainder) == len(n):
                remainder = compare(remainder, n)
        else:
            return remainder
```
 


## 五、书上例题与样图
 


![](https://i-blog.csdnimg.cn/blog_migrate/f33b65e2252c2643f087d11d9338046d.jpeg)
 


![](https://i-blog.csdnimg.cn/blog_migrate/00f628b26473fc06d518c122786f5919.jpeg)
 


![](https://i-blog.csdnimg.cn/blog_migrate/a5986eef277c6fdc55084b61c37661f4.png)
 


## 六、全部代码
 


```python
from tkinter import *
 
 
# 根据生成多项式获取生成码
def get_generate_code(s):
    digit = int(s[2]) + 1
    i = 0
    GC = ""
    p = s[2::4]
    while i < digit - 1:
        if p.find(str(digit - i - 1)) == -1:
            GC += "0"
        else:
            GC += "1"
        i += 1
    if s[-1:-3] == "x^1":
        GC += "0"
    else:
        GC += "1"
    return GC
 
 
# 延长初始序列
def length(m, n):
    p = m
    i = 1
    while i <= len(n) - 1:
        p += "0"
        i += 1
    return p
 
 
# 计算P异或Q并返回余数
def compare(p, q):
    m = ""
    check = 0
    for i in range(0, len(q), 1):
        if p[i] == q[i]:
            if check != 0:
                m += "0"
        else:
            m += "1"
            check = 1
 
    return m
 
 
# 计算生成校验序列
def get_CRC(m, n):
    index = len(n)
    m_front = m[0: index]
    remainder = compare(m_front, n)
    while True:
        if index < len(m):
            while len(remainder) < len(n):
                if index == len(m):
                    break
                remainder += m[index]
                index += 1
            if len(remainder) == len(n):
                remainder = compare(remainder, n)
        else:
            return remainder
 
 
root = Tk()
root.title("循环冗余校验码的编译")
screenWidth = root.winfo_screenwidth()
screenHeight = root.winfo_screenheight()
w = 400
h = 150
x = (screenWidth - w) / 2
y = (screenHeight - h) / 2
root.geometry("%dx%d+%d+%d" % (w, h, x, y))
 
label1 = Label(root, text="请输入比特序列：", font="Helvetic 17")
entry1 = Entry(root)
label1.grid(row=0, column=0)
entry1.grid(row=0, column=1, sticky=W+E)
 
label2 = Label(root, text="请输入生成多项式：", font="Helvetic 17")
entry2 = Entry(root)
entry2.insert(0, "例：x^4+x^1+1")
label2.grid(row=1, column=0)
entry2.grid(row=1, column=1, sticky=W+E)
 
 
def c():
    bit_sequence = entry1.get()
    generating_polynomial = entry2.get()
    generate_code = get_generate_code(generating_polynomial)
    bit_sequence_final = length(bit_sequence, generate_code)
    crc_code = get_CRC(bit_sequence_final, generate_code)
    label3.config(text=bit_sequence + crc_code)
 
 
label3 = Label(root, text="                                     ", bg="white")
button = Button(root, text="生成发送序列", relief="groove", command=c)
label3.grid(row=2, column=1)
button.grid(row=2, column=0)
 
root.mainloop()
```
 


## 七、结语
 


能用一门课的知识去解决另一门课的问题，这感觉超棒的！！！
 


如果有同学对博主的程序有疑问也欢迎指正

---
> 原文链接: [Python实例: 实现循环冗余校验码的编码](https://blog.csdn.net/m0_66681776/article/details/123385022?spm=1011.2415.3001.5331)
> 作者: Ari He
