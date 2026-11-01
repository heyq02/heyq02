---
date: 2024-03-15
---

# 【趣味项目】一键生成LICENSE—更新日志

项目相关可以查看该文档 [【趣味项目】一键生成LICENSE](https://blog.csdn.net/m0_66681776/article/details/136719833?spm=1001.2014.3001.5501)，此文档主要介绍最新版的功能以及相较于上一版产生的新改动
最新版本：[v1.7.2](https://www.npmjs.com/package/@xxhls/get-license?activeTab=readme)

## 使用

```shell
npm install @xxhls/get-license -g

get-license --license=mit
```

## 功能

目前总共支持 13 款开源协议，与 GitHub 创建项目时的可选项匹配

- `--license=mit`: MIT LICENSE
- `--license=apache2`: Apache License 2.0
- `--license=gpl3`: GNU General Public License v3.0
- `--license=bsd2`: BSD 2-Clause License
- `--license=bsd3`: BSD 3-Clause License
- `--license=bsl1`: Boost Software License - Version 1.0
- `--license=cc01`: Creative Commons Zero v1.0
- `--license=epl2`: Eclipse Public License v2.0
- `--license=agpl3`: GNU Affero General Public License v3.0
- `--license=gpl2`: GNU General Public License v2.0
- `--license=lgpl2`: GNU Lesser General Public License v2.1
- `--license=mpl2`: Mozilla Public License 2.0
- `--license=un`: The Unlicense

## 优化

### 生成器优化

将生成器选择的逻辑放在 template 组件中，同时抛弃了枚举类型，选择使用 Map 来实现协议与生成器的映射关系

## 计划

当前版本已经可以涵盖大部分场景，如果需要额外添加新的协议，可以在 github 上提 Issue 或 PR
