---
title: Vue + FastAPI + MySQL 的迷你 Demo
description: 一个前后端分离的最小闭环：Vue 页面、FastAPI 接口与 MySQL 建表查询。
date: 2023-02-25
---

# Vue + FastAPI + MySQL 的迷你 Demo

```text
主要思路：监听用户名的输入值变化并调用api查询数据库，
如果用户名已存在则返回false
注意事项：网上很多装各种软件的教程，在这里就不赘述了。
vue.js要使用网盘里那个，因为方便。MySQL和fastapi跑的是默认端口，GoLive不知道是不是默认的5000，如果不是就改一下user.py里面的返回头吧，不然会有跨域问题。
SQL文件的使用就自己下一个DataGrip，按照教程连接再导入就行，新建数据库的那几条语句就不在文章里写了，如果后续有需要可以评论，我再详细教吧
```

```text
vue-2.6.12.js:
链接：https://pan.baidu.com/s/1Rq_eFx8AFfJV3UwYYWe_zQ?pwd=1234
提取码：1234
```

**项目目录：**

```text
Demo:.
  |–api
       |–user.py
  |–lib
       |–vue-2.6.12.js
  |–sql
       |–.sql
  |–demo.
```

**所需软件：**

- VSCode 安装`LiveServer`插件
- Anaconda 创建WebAPI虚拟环境，并安装`FastAPI[all]`
- MySQL 创建一名为test的database

## 前端页面部分

按照上述创建目录结构，并把vue**.js放入。

**注意，在跑前端的时候要点击VSC右下角的GoLive！**

前端代码如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Demo</title>
  </head>
  <body>
    <div id="app">
      <input type="text" v-model="username" />
    </div>
    <script src="./lib/vue-2.6.12.js"></script>
    <script>
      const vm = new Vue({
        el: '#app',
        data: {
          username: 'hq'
        },
        watch: {
          username(newValue, oldValue) {
            const xhr = new XMLHttpRequest()
            xhr.onreadystatechange = function () {
              if (xhr.readyState == 4 && xhr.status == 200) {
                const res = JSON.parse(xhr.responseText)
                if (res.exit) {
                  console.log('已存在')
                } else {
                  console.log('未存在')
                }
              }
            }
            xhr.open('get', 'http://localhost:8000/test/?un=' + this.username, true)
            xhr.send()
          }
        }
      })
    </script>
  </body>
</html>
```

## 后端部分

```bash
conda activate WebAPI
cd api
uvicorn user:app --reload
```

后端代码如下：

```python
from fastapi import FastAPI, Query, Response

import pymysql

cur = pymysql.connect(host="localhost", user="root", password="自己的密码", database="test", charset="GBK").cursor()
cur.execute("select username from user")
usernames = cur.fetchall()
cur.close()

pymysql.connect(host="localhost", user="root", password="自己的密码", database="heima-vue2-vue3-study", charset="GBK").close()

app = FastAPI()

@app.get("/test/")
async def root(response: Response, un=Query(None)):
    response.headers["Access-Control-Allow-Origin"] = 'http://localhost:5500'
    exit = False
    for username in usernames:
        if(un == username[0]):
            exit = True
            break
    return {
        "exit": exit,
    };
```

## 数据库部分

SQL代码如下：

```sql
create table user(
  id int,
  username varchar(40)
);
alter table user character set GBK;
insert into user(id,username) values(1,'h');
insert into user(id,username) values(2,'jh');
insert into user(id,username) values(3,'kf');
insert into user(id,username) values(4,'ld');
insert into user(id,username) values(5,'nx');
```

> 原文：[【Vue+FastAPI+MySQL的迷你 Demo】](https://blog.csdn.net/m0_66681776/article/details/128414059?spm=1011.2415.3001.5331) · 作者 m0_66681776
