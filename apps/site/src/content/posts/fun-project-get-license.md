---
title: 趣味项目：一键生成 LICENSE
date: 2024-03-14
---

# 趣味项目：一键生成 LICENSE

> [!TIP] 项目链接
> - 仓库（最新）：[xxhls/get-license](https://github.com/xxhls/get-license)
> - 旧版：[GitCode get-license](https://gitcode.com/m0_66681776/get-license)

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/ccefb18c60a164468cdbb0e0719bbb52.png)

## 项目介绍

一款用于自动生成开源项目协议的工具，可以通过 npm 进行安装后在命令行使用，非常方便

## 使用方式

```shell
npm install @xxhls/get-license -g

get-license --license=mit
```

## 技术选型

- typeScript: 支持类型体操
- chalk: 命令行输出色彩
- commander: 解析命令行参数
- fs-extra: 拓展原生 fs 的功能
- ini: 解析 .gitconfig 为对象
- parcel: 零配置打包工具

## 代码分析

![效果截图](https://i-blog.csdnimg.cn/blog_migrate/6b64204592ae2baa8cf401b5b5601051.png)

- bin: 存放可执行文件
- dist: 存放打包后文件
- src: 源代码
  - log: 日志显示
  - templates: 协议生成器
  - utils:
    - getConfig: 生成配置文件
    - getYear: 读取当前年份
    - isGitConfigExists: 判断Git配置是否存在
    - question: 命令行交互
  - index.ts: 主函数
- package.json: npm 包配置文件
- tsconfig.json: ts 配置文件

## 思路详解

该部分我会挑选几个代码量相对多一些的文件进行思路解析，具体可以去代码仓库克隆下来查看

### 配置生成函数

```ts
import os from 'os'
import path from 'path'

import fs from 'fs-extra'
import ini from 'ini'

import { error, info, warn } from '../log'
import isGitconfigExists from './isGitconfigExists'
import question from './question'

interface IConfig {
  name: string
  email: string
}

const getConfig = async () => {
  const config: IConfig = {
    name: 'username',
    email: 'xxx@email.com'
  }

  // 检测是否存在 .gitconfig 文件
  const isExists = isGitconfigExists()
  if (isExists) {
    info('检测到 .gitconfig 文件')
    // 读取配置文件
    const configPath = path.join(os.homedir(), '.gitconfig')
    const configStr = fs.readFileSync(configPath, 'utf-8')
    const configTemp = ini.parse(configStr)
    config.name = configTemp.user.name
    config.email = configTemp.user.email

    info(`用户名: ${config.name}`)
    info(`邮箱: ${config.email}`)
  } else {
    warn('未检测到 .gitconfig 文件')
    // 创建配置文件
    const name = await question('请输入用户名: ')
    const email = await question('请输入邮箱: ')

    config.name = name
    config.email = email
  }

  return config
}

export default getConfig
```

1. 判断全局 git 是否存在
2. 若存在，则通过 os.homedir 拼接出路径，读取文件后用 ini 进行解析
3. 若不存在，则进行命令行交互得到需要的用户名和邮箱

### 主函数

```ts
import { Command } from 'commander'
import fs from 'fs-extra'

import { info, debug, warn, error } from './log'
import licenseMap from './templates'
import { License } from './templates'
import type { LicenseType } from './templates'
import getConfig from './utils/getConfig'

const main = async () => {
  const program = new Command()

  program.name('get-license').description('Get License').version('0.1.7')

  program.requiredOption('--license <license>', 'Select License').parse(process.argv)

  const options = program.opts()
  const { license } = options

  if (!license) {
    error('未选择 License 类型')
    process.exit(1)
  } else if (license === 'mit' || license === 'MIT') {
    info('成功选择 MIT License')
    const generator = licenseMap[License.MIT]
    const config = await getConfig()
    const licenseStr = generator(config.name, config.email)
    const licensePath = `${process.cwd()}/LICENSE`
    fs.outputFileSync(licensePath, licenseStr)
  } else {
    error('未知的 License 类型')
    process.exit(1)
  }
}

main()
```

1. 读取需要的命令行参数 license
2. 根据 license 匹配相应的协议生成器
3. 生成配置文件
4. 将配置传入生成器得到协议
5. 在当前文件夹创建 LICENSE 并写入协议内容

## 更新预期

涵盖 Github 支持的全部协议
