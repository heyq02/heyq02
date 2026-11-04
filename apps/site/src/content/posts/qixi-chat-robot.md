---
title: 七夕给自己 new 一个 chatRobot 当对象
description: 接百度 UNIT 和华为 CBS 两套对话服务，做一个能闲聊、能点歌的聊天机器人。
date: 2023-02-25
---

# 七夕给自己 new 一个 chatRobot 当对象

💎本文是博主周末做的小玩意，🔈大量参考了该博文：https://blog.csdn.net/NIeson2012/article/details/96476878 以及华为 https://support.huaweicloud.com/cbs/index.html、百度 https://cloud.baidu.com/doc/SPEECH/index.html 官方技术文档。有需要的朋友可以自行查阅。

👀华为后台语料库需自行（tiao）配置（jiao）：https://download.csdn.net/download/m0_66681776/86269857 可直接下载源文件。

## 1. 准备工作

- vscode
- anaconda
- 百度账号（已实名）
- 华为账号（已实名）

**在百度云官网 产品->人工智能->语音技术->短文本合成->立即使用->……** 创建一个应用（可以试用，跟着提示走就好）

**华为云官网也一样，在产品里找到智能语音交互机器人 CBS**，也是申请试用（博主作为学生，属实负担不起原价🥺）

后续的 APP_ID 之类的也在这些里面找就行，技术文档里有直达链接，很方便🙂。

用创建一个虚拟环境（对于不同的项目最好相互环境独立），最好是 3.6，高版本有些库不支持。

安装 `pygame`、`pyaudio`、`baidu-sip`、`huaweicloudsdkcore` 和 `huaweicloudsdkcbs` 库（pip 和 conda 都试一试，哪个行用哪个😆）

## 2. 设计思路

1. 开始程序
2. 录制音频并存储：使用 pyaudio 库进行录制，wave 库进行 .wav 文件的存储
3. 识别音频文件：上传至百度 AI 平台 SDK 鉴权调用 API
4. 返回 sentence：对返回的内容进行抽取
5. 判断 sentence is not "退出程序"：yes 继续，no 退出程序
6. 上传 sentence：上传至华为 AI 平台 SDK 鉴权调用 API
7. 返回 response：对返回的内容进行抽取
8. 语音合成 response：上传至百度……
9. 存储音频文件：对返回的内容……
10. 播放音频文件：使用 pygame 库进行播放
11. 退出程序

## 3. 项目源码

这部分反而对博主而言是最简单的，录音 / 播放在 CSDN 查查就有很多，API 的调用官方文档已经恨不得把饭喂我们吃了，简简单单 `CV` 一波🉑。

**文件夹的架构按博主的来，路径都是相对的。博主是用的 VSC，所以在 launch.json 将 functions 设置为根目录。_pychae_ 是在程序运行过程中自己建立起来的。**

```text
chatRobot:
    |_>.vscode:
        |_>launch.json
    |_>conclusion:
        |_>conclusion.ipynb
        |_>conclusion.md
    |_>functions:
        |_>__init__.py
        |_>baidu.py
        |_>huawei.py
        |_>recoder.py
    |_>music:
        |_>myvoice.wav
        |_>robotVoice.mp3
    |_>secrets:
        |_>baiduSecrets.csv
        |_>huaweiSecrets.csv
    |_>tests:
        |_>test.py
    |_>main.py
```

### 3.1 recoder 类

```python
"""
参考博文:
    @author: https://nieson.blog.csdn.net/?type=blog
    @blog: https://blog.csdn.net/NIeson2012/article/details/96476878
"""
import wave
import time
from pyaudio import PyAudio, paInt16
from pygame import mixer,quit

class recoder():

    def __init__(self, filepath="music/myvoice.wav") -> None:
        """_summary_

        Args:
            filepath (str): 文件保存位置
        """
        self.framerate = 16000
        self.num_samples = 2000
        self.channels = 1
        self.sampwidth = 2
        self.FILEPATH = filepath

    def save_wave_file(self, filepath: str, data: list) -> None :

        """_summary_

        Args:
            filepath (str): 文件保存路径
            data (list): 音频数据
        """

        wf = wave.open(filepath, "wb")
        wf.setnchannels(self.channels)
        wf.setsampwidth(self.sampwidth)
        wf.setframerate(self.framerate)
        wf.writeframes(b''.join(data))
        wf.close()

    def recordVoice(self) -> None :

        """_function_
            记录声音
        """

        pa = PyAudio()
        #打开一个新的音频stream
        stream = pa.open(format=paInt16, channels=self.channels,
                        rate=self.framerate, input=True, frames_per_buffer=self.num_samples)
        my_buf = [] #存放录音数据

        t = time.time()
        print('正在录音...')

        while time.time() < t + 10:  # 设置录音时间（秒）
            #循环read，每次read 2000frames
            string_audio_data = stream.read(self.num_samples)
            my_buf.append(string_audio_data)
        print('录音结束.')
        self.save_wave_file(self.FILEPATH, my_buf)
        stream.close()

    def playVoice(self, filepath="music/robotVoice.mp3"):
        """_summary_

        Args:
            filepath (_type_): 待播放文件路径
        """
        mixer.init()
        mixer.music.load(filepath)
        mixer.music.play()
        time.sleep(10)
        mixer.music.stop()
        quit()


if __name__ == "__main__":
    recoder = recoder("music/myvoice.wav")
    recoder.recordVoice()
    recoder.playVoice("music/myvoice.wav")
```

### 3.2 huawei 类

```python
from huaweicloudsdkcore.auth.credentials import BasicCredentials
from huaweicloudsdkcore.exceptions import exceptions
from huaweicloudsdkcore.http.http_config import HttpConfig
# 导入CBS服务库huaweicloudsdkcbs
from huaweicloudsdkcbs.v1.region.cbs_region import CbsRegion
from huaweicloudsdkcbs.v1 import *

import codecs
import csv

class huawei():

    def __init__(self) -> None:

        """_function_

            读取secrets内的各类密匙
        """

        with codecs.open('secrets/huaweiSecrets.csv', encoding='utf-8-sig') as f:
            for row in csv.DictReader(f, skipinitialspace=True):
                self.project_id = row["Project ID"]
                self.qabot_id = row["qabot_id"]
                self.ak = row["Access Key Id"]
                self.sk = row["Secret Access Key"]

    def getResponse(self, sentence: str) -> str:

        """_summary_

        Args:
            sentence (str): 待回复的语句

        Returns:
            str: 后台预设回复
        """

        # 使用默认配置
        config = HttpConfig.get_default_config()

        # 初始化客户端认证信息，使用当前客户端初始化方式可不填 project_id/domain_id，以BasicCredentials为例
        basic_credentials = BasicCredentials(self.ak, self.sk, self.project_id)

        # 初始化指定云服务的客户端 {Service}Client ，以初始化 Region 级服务CBS的 CbsClient 为例
        client = CbsClient.new_builder() \
            .with_http_config(config) \
            .with_credentials(basic_credentials) \
            .with_region(CbsRegion.value_of("cn-north-4")) \
            .build()

        # 以调用问答机器人会话接口ExecuteQaChat为例
        request = ExecuteQaChatRequest()
        # qabot_id获取方法参考本章节“准备工作”
        request.qabot_id = self.qabot_id
        request.body = PostRequestsReq(
            # session_id首轮不需要传入或可传入任意值，第二轮开始使用上一轮返回的session_id
            session_id="ad7a5010-3817...",
            question=sentence,
        )
        response = client.execute_qa_chat(request)

        # 异常处理
        try:
            request = ExecuteQaChatRequest()
            response = client.execute_qa_chat(request)
            print(response)
        except exceptions.ClientRequestException as e:
            pass
            # print(e.status_code)
            # print(e.request_id)
            # print(e.error_code)
            # print(e.error_msg)

        return response.qabot_answers.answers[0].answer[3:-4]


if __name__ == "__main__":
    huawei = huawei()
    print(huawei.project_id)
    print(huawei.getResponse("早上好"))
```

### 3.3 baidu 类

```python
from aip import AipSpeech
import codecs
import csv

class baidu():

    def __init__(self) -> None:

        """_function_

            读取secrets.csv内的各类密匙
        """

        with codecs.open('secrets/baiduSecrets.csv', encoding='utf-8-sig') as f:
            for row in csv.DictReader(f, skipinitialspace=True):
                self.APP_ID = row["APP_ID"]
                self.API_KEY = row["API_KEY"]
                self.SECRET_KEY = row["SECRET_KEY"]
        self.client = AipSpeech(self.APP_ID, self.API_KEY, self.SECRET_KEY)



    def getWords(self, filepath="music/myvoice.wav") -> str:

        """_summary_

        Args:
            filepath (str): 待识别语音

        Returns:
            str: 识别后字符串
        """

        def get_file_content(filePath: str):
            with open(filePath, 'rb') as fp:
                return fp.read()

        result = self.client.asr(get_file_content(filepath), 'pcm', 16000, {
            'dev_pid': 1537,})
        return result["result"][0]

    def getVoice(self, sentence: str):

        filePath = "music/robotVoice.mp3"
        result  = self.client.synthesis(sentence, 'zh', 1, {
        'vol': 5, 'per': 111,
        })

        # 识别正确返回语音二进制 错误则返回dict 参照下面错误码
        if not isinstance(result, dict):
            with open(filePath, 'wb') as f:
                f.write(result)
                f.close()

if __name__ == "__main__":
    baidu = baidu()
    print(baidu.APP_ID)
    response = baidu.getWords("music/myvoice.wav")
    print(response)
    baidu.getVoice("早上好")
```

### 3.4 密钥文件

```csv
IAM Name,IAM ID,Project ID,qabot_id,User Name,Access Key Id,Secret Access Key
******,******,******,******,******,******,******
APP_ID,API_KEY,SECRET_KEY
******,******,******
```

## 4. 总结

本次的小项目完成的还算成功，但是录音 / 播放功能属实很拉胯，是固定时间的。有个思路，参照微信用空格键控制语音的输入与输出，感兴趣的朋友可以试试💡。

点赞👍收藏🔸加关注💖，回看不迷路！
