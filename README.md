# 图片处理

目前的功能：预览，压缩

## 参数

```
inputel: Element,                     //file输入框对象
options: {
    maxSize: Number,                  //文件最大限制(默认3M), 如启用isZip将不验证此项
    isZip: Boolean,                   //是否压缩
    zipWidth: Number,                 //如果等于1，宽高为原图，如果小于1，宽高进行按该值缩放，如果大于1，宽度设置为该值，高度进行比例放大或缩小
    zipQuality: Number(0-1),          //按该质量进行压缩
    isZip: Boolean,                   //是否压缩
    readAs: String,                   //文件转化设置(默认dataurl), 选项：dataurl(转化为url的形式), binarystring(转化为二进制码), text(转化为文本)
    loadStart: Function,              //开始读取回调
    loadEnd: Function,                //读取结束回调
    error: Function,                  //错误处理回调
    success: Function(array, handle), //成功处理回调,接收两个参数,array为处理的结果值，第一个为一个数组，例如base64字符串，在支持多图上传下返回的是所有base64组成的数组
                                      //第二个也是数组，是base64只保留base64，以后的数据组成的数组，七牛云的上传会用到逗号以后的数据
}
```

## 示例

```
import fileReader from '路径'

fileReader(fileInput, {
    readAs: 'dataurl',
    zip: true,
    zipWidth: 1,
    zipQuality: 0.7,
    success: (result) => {
        
    }
})

```

