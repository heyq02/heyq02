---
date: 2023-03-20
---

# Git操作实战

本文主要从**建立仓库**:house_with_garden:、**仓库克隆**:eyes:、**多人协作**:sunglasses:、**分支管理**:ear_of_rice:、**提交规范**:balloon:五个方面，面向**实际使用**的角度总结了git操作，覆盖了绝大部分使用场景。

本文阅读完后可以应付绝大部分git操作，类似版本回退、多分支协作等一些不常用操作读者可以自行了解:v:

本文以CSDN的GitCode为例进行**实操**:punch:讲解，仓库为公有，大家可以随意进行push、pull等git操作的联系

浅浅求个关注:sparkles::sparkles::sparkles:

## 1. 建立仓库:house_with_garden:

### 进入GitCode官网，地址：https://gitcode.net/dashboard/projects/home

### 点击New Project

![](https://i-blog.csdnimg.cn/blog_migrate/edadec8737db6a5fa989faaa76b71ea5.png)

### 点击Create blank project即可进入仓库创建页面

![](https://i-blog.csdnimg.cn/blog_migrate/7d60c1bfa972ccdfc202b0b56badb04a.png)

### 简要概述一下这几个选项

![](https://i-blog.csdnimg.cn/blog_migrate/40a08f4c7ced19acf83f6a8142001d65.png)

![](https://i-blog.csdnimg.cn/blog_migrate/ccc32e8e7bb776f4f58a76f5ed41e926.png)

- Project name: 仓库名称，中英文都可以
- Project slug: 仓库url名称，只能英文
- Project description: 仓库描述
- Project tags: 仓库标签
- Visibility Level: 仓库可见性，Privite就是私有仓库，Public就是公有仓库
- Initialize res...: 是否初始化README，勾选就会创建一个README.md的文件

### 点击Create project

![](https://i-blog.csdnimg.cn/blog_migrate/8bbf2a1237ee264d7a3bc3aebe202809.png)

### 仓库新建完毕，地址：https://gitcode.net/m0_66681776/test

## 2. 仓库克隆:eyes:

### 下载git

下载地址：https://git-scm.com/downloads，
点击`download for windows`，
采用`next`安装法:kissing:

### 设置全局用户名与邮箱

```shell
git config --global user.name 'xxx'
git config --global user.name xxxx@xx.com
```

### 拉取仓库

```shell
git clone https://gitcode.net/m0_66681776/test
```

![](https://i-blog.csdnimg.cn/blog_migrate/289052f9513191a045ffbf93e5ab5826.png)

### 仓库克隆完毕

![](https://i-blog.csdnimg.cn/blog_migrate/18a27b8a4df65d311129714f47684db2.png)

## 3. 多人协作

### 建一个测试文件hello.txt

![](https://i-blog.csdnimg.cn/blog_migrate/9880bcbaee0d59421ad2dabb1ae7b995.png)

### 制造冲突

如果是个人项目，不需要进行协作，可以直接add+commit+push，但是多人协作就必须考虑到代码的冲突:boom:

我们在网页端人为创建一个文件，此时原创git仓库和本地仓库就产生了冲突:boom:

![](https://i-blog.csdnimg.cn/blog_migrate/8e065ac2f436761909fb6b5a82bd12f1.png)

### 解决冲突

由于远程仓库和本地仓库不一致，需要使用暂存操作暂存本次更改，再进行fetch+merge拉取远程仓库的修改，然后pop弹出暂存栈，就可以正常进行add+commit+push了

_暂存更改_

- git stash
  _拉取远程仓库_
- git fetch origin master
- git merge origin master
  _换源更改_
- git stash pop
  _提交更改_
- git add .
- git commit -m "xxxx"
- git push origin master

GitCode有点奇怪，需要使用token，而不是用户名和密码

![](https://i-blog.csdnimg.cn/blog_migrate/5daac19b3a5b444fdc8b958a3ae6ead6.png)

![](https://i-blog.csdnimg.cn/blog_migrate/4e927712653d516b79e1dab24843a5b2.png)

### 查看远程仓库

![](https://i-blog.csdnimg.cn/blog_migrate/08b7aa63a1a05dc4cec544e534da2f2d.png)

## 4. 分支管理

### 新建分支

git branch test

### 查看全部分支

![](https://i-blog.csdnimg.cn/blog_migrate/95ab39c15e5c7e38e1a909e0eedaa5a0.png)

### 切换分支

git checkout test

![](https://i-blog.csdnimg.cn/blog_migrate/cf5c96a7ace3b5272f531a270a501ab7.png)

### 在当前分支进行提交

需要注意的是git push 要用test(分支名)

![](https://i-blog.csdnimg.cn/blog_migrate/b4d207176d01eb752ea9004b4f2f4977.png)

### 查看远程仓库

主分支上没有hello222.txt

![](https://i-blog.csdnimg.cn/blog_migrate/dd18a46c83678401683eeb33eeac4d4f.png)

切换分支为test后可以看见hello222.txt

![](https://i-blog.csdnimg.cn/blog_migrate/96c16cb19967938518e33e5174177d0d.png)

### 合并test分支进master

![](https://i-blog.csdnimg.cn/blog_migrate/c85850cd1eb4067248cacc88f7d46ce8.png)

- git checkout master 切换为主分支
- git merge test 合并test到主分支
- git add + commit + push 常规操作

出错的原因是远程是master，而不是main，引以为戒

### 查看远程主分支

![](https://i-blog.csdnimg.cn/blog_migrate/87f8171f91b333ab1b6778993d132a59.png)

## 5. 提交规范

使用commitizen进行提交的格式化

### 全局安装

```sh
npm install -g commitizen
```

### 初始化

```sh
commitizen init cz-conventional-changelog --save --save-exact
```

### 规范化提交

先写一个.gitignore用来忽略node_modules文件夹

```sh
echo '/node_modules' > .gitignore
```

执行git add

此时不再需要git commit，改用git cz，进入命令行提示

![](https://i-blog.csdnimg.cn/blog_migrate/8f356943e3c492ce501dc44768dabce9.png)

```
Header部分只有一行，包括三个字段：type（必需）、scope（可选）和subject（必需）。

（1）type

type用于说明 commit 的类别，只允许使用下面7个标识。

feat：新功能（feature）
fix：修补bug
docs：文档（documentation）
style： 格式（不影响代码运行的变动）
refactor：重构（即不是新增功能，也不是修改bug的代码变动）
test：增加测试
chore：构建过程或辅助工具的变动
如果type为feat和fix，则该 commit 将肯定出现在 Change log 之中。其他情况（docs、chore、style、refactor、test）由你决定，要不要放入 Change log，建议是不要。

（2）scope

scope用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同。

（3）subject

subject是 commit 目的的简短描述，不超过50个字符。

以动词开头，使用第一人称现在时，比如change，而不是changed或changes
第一个字母小写
结尾不加句号（.）
```
