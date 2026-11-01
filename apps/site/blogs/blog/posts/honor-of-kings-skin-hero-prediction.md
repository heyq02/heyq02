---
title: 王者荣耀皮肤 / 英雄预测（TensorFlow）
description: 用 TensorFlow 训练 CNN，从皮肤图片预测英雄，附数据处理、训练与预测代码。
date: 2023-02-25
---

# 王者荣耀皮肤 / 英雄预测（TensorFlow）

> 本项目的思路是通过英雄的多个皮肤进行模型的训练，进而对给定的原皮实施对应英雄的预测。包括的模块有 dataset 的建立，卷积神经网络模型等。
>
> 码云开源地址：aov_ornament-hero: 皮肤进行模型训练原皮进行英雄预测
>
> 网盘下载地址：https://pan.quark.cn/s/da3506ed4053

## 一、思路讲解

使用进行图片的 RGB 矩阵化处理

使用进行多维矩阵的创建与赋值

使用进行 dataset 的预览与测试

使用进行神经网络的建立与训练

## 二、全部代码

### 1、main.py

```python
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
from dataset import datasetss
from tensorflow import keras
from keras import layers, models
from create_test_images import create_test_images

"""提取数据集dataset"""
dataset = datasetss()
# 像素值归一化处理
train_images = dataset.train_images / 255.0
test_images = dataset.test_images / 255.0
train_labels = dataset.train_labels
test_labels = dataset.test_labels


"设置英雄名"
class_names = ['DiRenJie', 'LuBanQiHao',
               'SunShangXiang', 'XiaoQiao', 'DiaoChan']


#"测试数据集"
# plt.figure(figsize=(50, 50))
# plt.imshow(test_images[4])
# plt.show()


"建立模型"
model = models.Sequential()
#卷积层&池化层
model.add(layers.Conv2D(32, (3, 3), activation='relu', input_shape=(50, 50, 3)))
model.add(layers.MaxPooling2D((2, 2)))
model.add(layers.Conv2D(64, (3, 3), activation='relu'))
model.add(layers.MaxPool2D((2, 2)))
model.add(layers.Conv2D(64, (3, 3), activation='relu'))
# 展开层
model.add(layers.Flatten())
# 全连接层
model.add(layers.Dense(64, activation='relu'))
model.add(layers.Dense(5))


"编译模型"
model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])


"训练模型"
# 拟合数据
model.fit(train_images, train_labels, epochs=10)


"模型预测"
probability_model = tf.keras.Sequential([model, tf.keras.layers.Softmax()])
predictions = probability_model.predict(test_images)

# guess_images =  create_test_images("0.jpg")
#
# probability_model = tf.keras.Sequential([model, tf.keras.layers.Softmax()])
# predictions = probability_model.predict(guess_images)

"结果输出"
print(class_names[np.argmax(predictions[2])])


# "训练模型"
# history = model.fit(train_images, train_labels, epochs=10,
#                     validation_data=(test_images, test_labels))
#
# "评估准确度"
# plt.plot(history.history['accuracy'], label='accuracy')
# plt.plot(history.history['val_accuracy'], label = 'val_accuracy')
# plt.xlabel('Epoch')
# plt.ylabel('Accuracy')
# plt.ylim([0.5, 1])
# plt.legend(loc='lower right')
# plt.show()
```

### 2、dataset.py

```python
import functions2


"设置datasetss类"
class datasetss():
    def __init__(self):
        self.train_images = functions2.get_train_images()
        self.train_labels = functions2.get_train_labels()
        self.test_images = functions2.get_test_images()
        self.test_labels = functions2.get_test_labels()
```

### 3、function2.py

```python
import cv2 as cv
import numpy as np


"设置train与test标签"
trainfile_labels = ["00", "01", "02", "03", "04", "05",
                    "10", "11", "12", "13", "14", "15", "16", "17",
                    "20", "21", "22", "23", "24", "25", "26",
                    "30", "31", "32", "33", "34", "35",
                    "40", "41", "42", "43", "44"]
testfile_labels = ["0", "1", "2", "3", "4"]


"train_images"
def get_train_images():
    # 构建全零ndarray
    train_images = np.zeros((32, 50, 50, 3))
    i = 0
    for label in trainfile_labels:
        # 选择路径名
        image_path = "D:/WZRY_Project/aov_ornament-hero/images/train_images/" + label + ".jpg"
        # 以RGB模式读取image
        img_ini = cv.imread(image_path, 1)
        # 缩小image到50x50像素
        img_fin = cv.resize(img_ini, (50, 50), interpolation=cv.INTER_CUBIC)
        # 将三维数组赋值给四维数组的后三维
        train_images[i, :, :, :] = img_fin
        i = i + 1
    return train_images


"train_labels"
def get_train_labels():
    # 构建全零ndarray
    train_labels = np.zeros((32, 1))
    i = 0
    for label in trainfile_labels:
        # 将一维数组赋值给二维数组的第二维
        train_labels[i][0] = label[0]
        i = i + 1
    return train_labels


"test_images"
def get_test_images():
    test_images = np.zeros((5, 50, 50, 3))
    i = 0
    for label in testfile_labels:
        image_path = "D:/WZRY_Project/aov_ornament-hero/images/test_images/" + label + ".jpg"
        img_ini = cv.imread(image_path, 1)
        img_fin = cv.resize(img_ini, (50, 50), interpolation=cv.INTER_CUBIC)
        test_images[i, :, :, :] = img_fin
        i = i + 1
    return test_images


"test_labels"
def get_test_labels():
    test_labels = np.zeros((5, 1))
    i = 0
    for label in testfile_labels:
        test_labels[i][0] = label[0]
        i = i + 1
    return test_labels
```

### 4、create_test_images.py

```python
import cv2 as cv
import numpy as np


def create_test_images(name):
    test_images = np.zeros((1, 50, 50, 3))
    image_path = "D:/WZRY_Project/aov_ornament-hero/images/guess_images/" + name
    img_ini = cv.imread(image_path, 1)
    img_fin = cv.resize(img_ini, (50, 50), interpolation=cv.INTER_CUBIC)
    test_images[0, :, :, :] = img_fin
    return test_images
```

## 三、结语

很遗憾，这个项目的预测并不准确，究其原因便是训练集太小了。然而，其中的各种方法依旧对于新手有借鉴意义。

> 原文：[【王者荣耀】皮肤-英雄 预测（tensorflow）](https://blog.csdn.net/m0_66681776/article/details/124270086?spm=1011.2415.3001.5331) · 作者 m0_66681776
