---
title: Anaconda + VSCode 编码错误
description: VSCode 集成终端激活 Conda 时踩到 GBK 无法编码的 UnicodeEncodeError，以及改 conda 源码用 gb18030 绕过的做法。
date: 2024-03-07
---

# Anaconda + VSCode 编码错误

::: info {title="环境"}
- 平台：Windows 11 家庭版（v22621.3155）
- 编辑器：Visual Studio Code（v1.87.0）
- 插件：Python（v2024.2.1）
- Conda：v24.1.2
:::

::: tip {title="现象一句话"}
VSCode 自动配好 Conda 后，集成 PowerShell 激活环境报 `UnicodeEncodeError: 'gbk' codec can't encode character`，外部终端却正常。
:::

## 1. 问题描述

VSCode 在安装 Python 插件后会提示配置 Conda 环境；自动配置完成后，启动 PowerShell 报错：

`UnicodeEncodeError: 'gbk' codec can't encode character '\ue1bb' in position 491: illegal multibyte sequence`

外部终端不会出现，怀疑与 Python 插件解析 / 激活脚本输出有关。

```text
# >>>>>>>>>>>>>>>>>>>>>> ERROR REPORT <<<<<<<<<<<<<<<<<<<<<<

    Traceback (most recent call last):
      File "D:\Softwares\Anaconda3\Lib\site-packages\conda\exception_handler.py", line 17, in __call__
        return func(*args, **kwargs)
      File "D:\Softwares\Anaconda3\Lib\site-packages\conda\cli\main.py", line 112, in main_sourced
        print(activator.execute(), end="")
    UnicodeEncodeError: 'gbk' codec can't encode character '\ue1bb' in position 491: illegal multibyte sequence

`$ D:\Softwares\Anaconda3\Scripts\conda-script.py shell.powershell activate base`
```

报错时 PATH 里还夹着「微信 web 开发者工具」一类含中文的路径；在 GBK 控制台下打印激活脚本输出时更容易炸。

## 2. 问题定位

![定位到 conda main_sourced](https://i-blog.csdnimg.cn/blog_migrate/b0776a0a15ef3afd348722c2ba166e56.png)

Ctrl + 点击跳到对应文件，可以看到：

```python
def main_sourced(shell, *args, **kwargs):
    """Entrypoint for the "sourced" invocation of CLI interface. E.g. `conda activate`."""
    shell = shell.replace('shell.', '', 1)

    from ..base.context import context

    context.__init__()
    init_loggers()

    from ..activate import _build_activator_cls

    try:
        activator_cls = _build_activator_cls(shell)
    except KeyError:
        from ..exceptions import CondaError

        raise CondaError('%s is not a supported shell.' % shell)

    activator = activator_cls(args)
    print(activator.execute(), end='')
    return 0
```

资料表明：默认控制台编码下，`print` 无法输出全部 Unicode 字符。

## 3. 解决方案

1. 文件顶部引入 `io`
2. 在打印前把 `sys.stdout` 设为 `gb18030`

```python
import io
import sys

def main_sourced(shell, *args, **kwargs):
    """Entrypoint for the "sourced" invocation of CLI interface. E.g. `conda activate`."""
    shell = shell.replace('shell.', '', 1)

    from ..base.context import context

    context.__init__()
    init_loggers()

    from ..activate import _build_activator_cls

    try:
        activator_cls = _build_activator_cls(shell)
    except KeyError:
        from ..exceptions import CondaError

        raise CondaError('%s is not a supported shell.' % shell)

    activator = activator_cls(args)
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='gb18030')
    print(activator.execute(), end='')
    return 0
```

::: warning {title="注意"}
这是改本机 conda 安装目录源码的权宜之计；升级 conda 后可能被覆盖，生产环境更稳妥的做法是清理 PATH 中的异常 Unicode、或统一终端为 UTF-8。
:::

![修复后激活成功](https://i-blog.csdnimg.cn/blog_migrate/c0953412ff1f79c3295a9ac1d2647872.png)
