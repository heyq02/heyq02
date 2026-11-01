---
title: 小贺同学的进制转换器：微信小程序
description: 把进制转换器搬进微信小程序：wxml 界面布局与 js 转换逻辑。
date: 2023-02-26
---

# 小贺同学的进制转换器：微信小程序

> 小程序已上线：小贺同学的进制转换器

![](https://i-blog.csdnimg.cn/blog_migrate/90bd25bf934228c71bcc8f3f961da5ac.jpeg)

## index.wxml

```html
<!--index.wxml-->
<!-- 结果展示栏 -->
<view id='display'>
  <view class="point_red">当前进制：{{system}}</view>
  <view class="point_blue">与君共勉</view>
  <view class="input_num1 re">={{result}}</view>
  <input class="input_num1" placeholder='最大输入12位' maxlength="12" bindinput="bindKeyInput"/>
</view>
<view id="choose">
  <button class="left" bindtap="clickKeyBoard" data-con="2">二进制</button>
  <button class="left right" bindtap="clickKeyBoard" data-con="8">八进制</button>
  <button class="left" bindtap="clickKeyBoard" data-con="10">十进制</button>
  <button class="left right sixteen" bindtap="clickKeyBoard" data-con="16">十六进制</button>
</view>
```

## index.js

```javascript
// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {
    system: '10进制',
    system_temp: '',
    result: '',
    result_temp: '',
    two: '',
    eight: '',
    ten: '',
    sixteen: '',
    },
  bindKeyInput: function (e) {
    if(this.data.system === '10进制'){
      var ten_num = Number(e.detail.value);
      var two_num = ten_num.toString(2);
      var eight_num = ten_num.toString(8);
      var sixteen_num = ten_num.toString(16);
      this.change_num(ten_num, two_num, eight_num, sixteen_num);
    };
    if(this.data.system === '2进制'){
      var two_num = e.detail.value;
      var ten_num = Number(parseInt(two_num, 2));
      var eight_num = ten_num.toString(8);
      var sixteen_num = ten_num.toString(16);
      this.change_num(ten_num, two_num, eight_num, sixteen_num);
    };
    if(this.data.system === '8进制'){
      var eight_num = e.detail.value;
      var ten_num = Number(parseInt(eight_num, 8));
      var two_num = ten_num.toString(2);
      var sixteen_num = ten_num.toString(16);
      this.change_num(ten_num, two_num, eight_num, sixteen_num);
    };
    if(this.data.system === '16进制'){
      var sixteen_num = e.detail.value;
      var ten_num = Number(parseInt(sixteen_num, 16));
      var eight_num = ten_num.toString(8);
      var two_num = ten_num.toString(2);
      this.change_num(ten_num, two_num, eight_num, sixteen_num);
    };
  },
  clickKeyBoard(e){
    let that = this;
    let input = e.currentTarget.dataset.con;
    that.handleInfo(input);
    if(this.data.system === '10进制'){
      this.setData({
        result: this.data.ten
      })
    };
    if(this.data.system === '2进制'){
      this.setData({
        result: this.data.two
      })
    };
    if(this.data.system === '8进制'){
      this.setData({
        result: this.data.eight
      })
    };
    if(this.data.system === '16进制'){
      this.setData({
        result: this.data.sixteen
      })
    };
  },
  handleInfo(input){
    this.system_temp = input + '进制';
    this.setData({
      system: this.system_temp
    })
  },
  change_num(a, b, c, d){
    this.setData({
      ten: a,
      two: b,
      eight: c,
      sixteen: d
    })
  }
})
```

## index.wxss

```css
/**index.wxss**/
/*结果展示框*/
#display {
  width: 99%;
  height: 300rpx;
  margin: auto;
  background-color: white;
  border-style: solid;
  border-color: black;
}
/*进制提示*/
#display .point_red{
  width: 45%;
  height: 40rpx;
  float: left;
  margin-top: 10rpx;
  margin-left: 1%;
  background-color: white;
  font-size: 30rpx;
  border-style: solid;
  border-color: black;
}
/*语录展示*/
#display .point_blue{
  width: 45%;
  height: 40rpx;
  float: right;
  margin-top: 10rpx;
  margin-right: 1%;
  background-color: white;
  font-size: 30rpx;
  text-align: right;
}
/*结果显示框*/
#display .input_num{
  width: 100%;
  height: 120rpx;
  float: right;
  background-color: white;
  font-size: 30rpx;
  border-style: solid;
  border-top: black;
  border-bottom: black;
}
/*数字输入框*/
#display .input_num1{
  width: 100%;
  height: 120rpx;
  float: right;
  background-color: white;
  font-size: 30rpx;
  text-align: right;
  font-size: 100rpx;
}
/*结果显示框*/
#display .re{
  background-color: white;
}
#choose {
  width: 99%;
  height: 600rpx;
  margin: auto;
  background-color: rgb(231, 223, 223);
  border-style: solid;
  border-color: black;
}
/*进制提示*/
#choose .left{
  width: 45%;
  height: 281rpx;
  float: left;
  margin-top: 10rpx;
  margin-left: 1%;
  background-color: white;
  font-size: 90rpx;
  text-align: center;
  border-style: solid;
  border-color: black;
}
/*语录展示*/
#choose .right{
  float: right;
  margin-right: 1%;
}
#choose .sixteen{
  font-size: 90rpx;
}
```

> 原文：[小贺同学的进制转换器-微信小程序](https://blog.csdn.net/m0_66681776/article/details/124806765?spm=1011.2415.3001.5331) · 作者 m0_66681776
