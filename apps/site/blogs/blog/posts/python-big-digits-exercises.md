---
title: 打印大数字与随机语句：Python 课后习题详解
description: 《Python 3 程序开发指南》第一章课后题：把 bigdigits 改成打印数字本身，以及数组统计、随机造句和取中间值。
date: 2023-02-26
---

# 打印大数字与随机语句：Python 课后习题详解

《Python 3 程序开发指南（第二版）》第一章的课后习题讲解。下面不是参考答案，但都能得出正确结果，代码是自己写的；题目太长的没有抄全，参考书放在文末。有差错欢迎指正。

## 1. 书中代码

### 1.1 bigdigits.py

> 主讲这个，后面的练习有很大程度的借鉴。

#### 1.1.1 源码

```python
import sys
Zero = ["  *** ",
        " *   *",
        " *   *",
        " *   *",
        " *   *",
        " *   *",
        " *   *",
        " *   *",
        "  *** "];
One = ["   *  ",
       "  **  ",
       " * *  ",
       "   *  ",
       "   *  ",
       "   *  ",
       "   *  ",
       "   *  ",
       " *****",];
Two = [" *****",
       "     *",
       "     *",
       "     *",
       "  *** ",
       " *    ",
       " *    ",
       " *    ",
       " *****"];
Three = [" **** ",
         "     *",
         "     *",
         "     *",
         " *****",
         "     *",
         "     *",
         "     *",
         " **** "];
Four = [" *   *",
        " *   *",
        " *   *",
        " *   *",
        "  ****",
        "     *",
        "     *",
        "     *",
        "     *"];
Five = ["  ****",
        " *    ",
        " *    ",
        " *    ",
        "  *** ",
        "     *",
        "     *",
        "     *",
        " *****"];
Six = ["  ****",
       " *    ",
       " *    ",
       " *    ",
       " *****",
       " *   *",
       " *   *",
       " *   *",
       " *****"];
Seven = ["  ****",
         " *   *",
         "     *",
         "     *",
         "     *",
         "     *",
         "     *",
         "     *",
         "     *",];
Eight = ["  *** ",
         " *   *",
         " *   *",
         " *   *",
         "  *** ",
         " *   *",
         " *   *",
         " *   *",
         "  *** "];
Nine = ["  *** ",
        " *   *",
        " *   *",
        " *   *",
        "  *** ",
        "     *",
        "     *",
        "     *",
        " *****"]
Digits = [Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine]
try:
    digits = input("Please input the number:")
    row = 0
    while row < 9:
        line = ""
        column = 0
        while column < len(digits):
            number = int(digits[column])
            digit = Digits[number]
            line += digit[row] + ""
            column += 1
        print(line)
        row += 1
except IndexError:
    print("usage: big_digits.py <number>")
except ValueError as err:
    print(err, "in", digits)
```

#### 1.1.2 讲解

观察源码，我们发现这个程序的的核心思路如下：

1. 输入原始数组digits[1，2，4，，……]（随意输入）
2. 从大数字数组Digits抽取第一个数字1对应的大数字
3. 将1对应的大数字第一行加到line字符串上
4. 进入循环，将原始数组每一个数字对应的大数字的第一行加到line上
5. 输出第一行
6. 进入循环，不断输出第2，3，……行
7. 结束代码

### 1.2 generate_grid.py

> 不讲这个了，因为博主也没咋懂，献上源码

#### 1.2.1 源码

```python
import random
def get_int(msg, minimum, default):
    while True:
        try:
            line = input(msg)
            if not line and default is not None :
                return default
            i = int(line)
            if i < minimum:
                print("must be >=", minimum)
            else:
                return i
        except ValueError as err:
            print(err)

rows = get_int("rows:", 1, None)
columns = get_int("columns:", 1, None)
minimum = get_int("minimum (or Enter for 0):", -1000000, 0)

default = 1000
if default < minimum:
    default = 2*minimum
maximum = get_int("maximum (or Enter for "+ str(default) +"):",
                  minimum, default)

row = 0
while row < rows:
    line = ""
    column = 0
    while column < columns:
        i = random.randint(minimum, maximum)
        s = str(i)
        while len(s) < 10:
            s = " " + s
        line += s
        column += 1
    print(line)
    row += 1
```

## 2. 课后练习

### 2.1 bigdigits.py 变形：不再打印 `*`，而是打印数字本身

#### 思路

在我看来，变形的最关键步骤在于将每一个大数字的每一行加在line字符串上。如果我能实现提取第一个大数字的第一行后，将其先进行转化，后加到line上，不就可以完美实现要求了。

#### 实现

```python
# 新建大数字数组
Zero = ["  *** ",
        " *   *",
        " *   *",
        " *   *",
        " *   *",
        " *   *",
        " *   *",
        " *   *",
        "  *** "]
One = ["   *  ",
       "  **  ",
       " * *  ",
       "   *  ",
       "   *  ",
       "   *  ",
       "   *  ",
       "   *  ",
       " *****",]
Two = [" *****",
       "     *",
       "     *",
       "     *",
       "  *** ",
       " *    ",
       " *    ",
       " *    ",
       " *****"]
Three = [" **** ",
         "     *",
         "     *",
         "     *",
         " *****",
         "     *",
         "     *",
         "     *",
         " **** "]
Four = [" *   *",
        " *   *",
        " *   *",
        " *   *",
        "  ****",
        "     *",
        "     *",
        "     *",
        "     *"]
Five = ["  ****",
        " *    ",
        " *    ",
        " *    ",
        "  *** ",
        "     *",
        "     *",
        "     *",
        " *****"]
Six = ["  ****",
       " *    ",
       " *    ",
       " *    ",
       " *****",
       " *   *",
       " *   *",
       " *   *",
       " *****"]
Seven = ["  ****",
         " *   *",
         "     *",
         "     *",
         "     *",
         "     *",
         "     *",
         "     *",
         "     *",]
Eight = ["  *** ",
         " *   *",
         " *   *",
         " *   *",
         "  *** ",
         " *   *",
         " *   *",
         " *   *",
         "  *** "]
Nine = ["  *** ",
        " *   *",
        " *   *",
        " *   *",
        "  *** ",
        "     *",
        "     *",
        "     *",
        " *****"]
Digits = [Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine]

try:
    # 输入待放大数组
    digits = input("Please input the number:")

    # 按行号输出大数字
    row = 0 # 初始行号
    while row < 9: # 总共输出9行
        line = "" # 初始行字符串
        column = 0
        while column < len(digits): # 输出大数字数量控制
            number = int(digits[column]) # 提取待放大数组第column个数字
            digit = Digits[number] # 从大数字数组中抽取对应大数字数组元素

            # 大数字数组元素*->number转换
            column_2 = 0 # 初始列号
            number_2 = str(digits[column]) # 转化number为str格式
            P = "" # 转化后初始行
            while column_2 < 6: # 总共转化6行
                # 提取第一个大数字第一行第一列进行比较
                if digit[row][column_2] == "*": # 字符为*
                    P += number_2
                else: #字符为blank
                    P += ' '
                column_2 += 1

            # 将转化后的第一个大数字的第一行加在初始行字符串上
            line += P + ""

            # line += digit[row] + ""
            column += 1
        # 输出第一行字符串
        print(line)
        # 行数加一
        row += 1
# 异常处理
except IndexError:
    print("usage: big_digits.py <number>")
except ValueError as err:
    print(err, "in", digits)
```

#### 例图

![](https://i-blog.csdnimg.cn/blog_migrate/14dfa607dac36fb021acba0d80d0d084.png)

### 2.2 打印输入数组本身、个数、和、最值、均值

#### 思路

数组的输入比较简单，while循环就可以很轻松做到。输出的话用print函数。数组个数可以使用len函数。和直接用while全都循环加起来。最值可以参考学过的上的两两比较。均值直接用和除以个数。

#### 实现

```python
# 数组输入
number_str = []
while True:
    P = ""
    P += input("enter a number or Enter to finish: ")
    # 判断是否结束
    if P != " ":
        number_str += P
    else:
        break

# 将str型数组整体转换为int型数组
number_str_new = list(map(int, number_str))
print("numbers:",number_str_new)

# 直接利用函数求数组元素数量
count = len(number_str_new)

# 设置初始最值
highest = lowest = number_str_new[0]

count_2 = 0
summ = 0

# 求和、求最值
while count_2 < count:# 全部元素进行循环

    summ += number_str_new[count_2]# 求和

    if lowest > number_str_new[count_2]:# 依次进行比较
        lowest = number_str_new[count_2]

    if highest < number_str_new[count_2]:# 同上
        highest = number_str_new[count_2]

    count_2 += 1# 下一个元素

# 求平均数
mean = summ/count
mean_2 = round(mean, 11)# 对mean保留11位小数

# 输出最终数据
print("count = ",count," sum = ",summ," lowest = ",lowest," highest = ",highest," mean = ",mean_2)

'''
求最值原始代码
lowest = number_str_new[0]
count_lowest = 0
while count_lowest < count:
    if lowest > number_str_new[count_lowest]:
        lowest = number_str_new[count_lowest]
    count_lowest += 1

highest = number_str_new[0]
count_highest = 0
while count_highest < count:
    if highest < number_str_new[count_highest]:
        highest = number_str_new[count_highest]
    count_highest += 1
'''

```

#### 例图

![](https://i-blog.csdnimg.cn/blog_migrate/b5c4c36962546751c433200bda6cb994.png)

### 2.3 随机生成简单语句（冠词、主语、动词、状语）

#### 思路

创建冠词数组、主语数组、动词数组、状语数组，使用random.choice随机从数组中抽取元素组合。

#### 实现

```python
import random

# 编写词典数组集
article = ["The","A","One","Another",]
subject = ["mouse","cow","tiger","rabbit","dragon","snake",
           "horse","sheep","monkey","cock","dog","pig"]
verb = ["singed","danced","rapped","played the basketball"]
adverbial = ["happily","angrily","sadly"]

#输出随机组合语句
choice = random.randint(0,1)# 随机选取0或1
if choice == 0:
    # 输出冠词+主语+动词+状语
    print(random.choice(article),random.choice(subject),
      random.choice(verb),random.choice(adverbial))
else:
    # 输出冠词+主语+动词
    print(random.choice(article),random.choice(subject),
      random.choice(verb))
```

#### 例图

![](https://i-blog.csdnimg.cn/blog_migrate/8b6732008e872e77c8baae4d0233fd1f.png)

### 2.4 控制 2.3 的输出语句数量

思路

while语句和input函数

#### 实现

```python
import random

# 编写词典数组集
article = ["The","A","One","Another",]
subject = ["mouse","cow","tiger","rabbit","dragon","snake",
           "horse","sheep","monkey","cock","dog","pig"]
verb = ["singed","danced","rapped","played the basketball"]
adverbial = ["happily","angrily","sadly"]

# 定义函数-随机输出row_max条语句
def output_sentence(row_max):
    row = 1
    while row <= int(row_max):
        #输出随机组合语句
        choice = random.randint(0,1)# 随机选取0或1
        if choice == 0:
            # 输出冠词+主语+动词+状语
            print(random.choice(article),random.choice(subject),
                  random.choice(verb),random.choice(adverbial))
        else:
            # 输出冠词+主语+动词
            print(random.choice(article),random.choice(subject),
                  random.choice(verb))
        row += 1

# 判断是否需要输出行数
print("whether to specify a row parameter ?:")
print("Yes(Y)    No(N)")
judge = ""
judge += input("input your answer:")

if judge == "N":
    output_sentence(5)
else:
    row_max = input("please input the row parameter: ")# 输入行数
    output_sentence(row_max)
```

#### 例图

![](https://i-blog.csdnimg.cn/blog_migrate/e0de38d153859ef396b96a9ce5778749.png)

### 2.5 将 2.2 的数组排序并输出中间值

#### 思路

从第一个元素开始，每一个元素都要和其后面的每一个元素进行比较。若比后面的大，则交换。直到实现数组元素从小到大排序。中间值的化与个数有关，具体方法不再赘述，代码中的注释很详细。

#### 实现

```python
# 数组输入
number_str = []
while True:
    P = ""
    P += input("enter a number or Enter to finish: ")
    # 判断是否结束
    if P != " ":
        number_str += P
    else:
        break

# 将str型数组整体转换为int型数组
number_str_new = list(map(int,number_str))
print("numbers:",number_str_new)

# 直接利用函数求数组元素数量
count = len(number_str_new)

# 设置初始最值
highest = lowest = number_str_new[0]

count_2 = 0
summ = 0

# 求和、求最值
while count_2 < count:# 全部元素进行循环

    summ += number_str_new[count_2]# 求和

    if lowest > number_str_new[count_2]:# 依次进行比较
        lowest = number_str_new[count_2]

    if highest < number_str_new[count_2]:# 同上
        highest = number_str_new[count_2]

    count_2 += 1# 下一个元素

# 求平均数
mean = summ/count
mean_2 = round(mean, 11)# 对mean保留11位小数

# 从小到大排序
index_4 = 0# 从第一个元素开始
while index_4 < count:
    index_5 = index_4 + 1
    # 将第一个元素依次和后面全部元素对比
    while index_5 < count:
        # 如果第一个大，则交换，将最小的交换到第一位置
        if number_str_new[index_4] > number_str_new[index_5]:
            number_str_new[index_4],number_str_new[index_5]=number_str_new[index_5],number_str_new[index_4]
        index_5 += 1
    index_4 += 1
print(number_str_new)

# 取中间值
if count % 2 == 1:# 判断为奇数
    index_odd = (int(count)-1)/2# 计算下标
    middium = number_str_new[int(index_odd)]
else:
    index_even_1 = int(count)/2# 计算中间两个下标
    index_even_2 = (int(count)/2)-1
    middium_1 = number_str_new[int(index_even_1)]# 取出中间两个元素的值
    middium_2 = number_str_new[int(index_even_2)]
    middium = (middium_1 + middium_2)/2

# 输出最终数据
print("count = ",count," sum = ",summ," lowest = ",lowest," highest = ",highest," mean = ",mean_2," middium = ",middium)

'''
求最值原始代码
lowest = number_str_new[0]
count_lowest = 0
while count_lowest < count:
    if lowest > number_str_new[count_lowest]:
        lowest = number_str_new[count_lowest]
    count_lowest += 1

highest = number_str_new[0]
count_highest = 0
while count_highest < count:
    if highest < number_str_new[count_highest]:
        highest = number_str_new[count_highest]
    count_highest += 1
'''

```

#### 例图

![](https://i-blog.csdnimg.cn/blog_migrate/ed207f1018e1056720414d1d776a18c3.png)

##  结语：

学过 C 语言之后再来看这些练习，很多地方会有一点触类旁通的感觉。

参考书：《Python 3 程序开发指南（第二版修订版）》，人民邮电出版社。

> 原文：[打印【大数字】、生成随机语句——课后习题（详解）](https://blog.csdn.net/m0_66681776/article/details/122895922?spm=1011.2415.3001.5331) · 作者 m0_66681776
