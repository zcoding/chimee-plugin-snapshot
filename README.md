# chimee-plugin-snapshot
Snapshot plugin for Chimee Player

简单好用的 Chimee 播放器截图插件

## Install

```bash
# 依赖于 chimee， 首先需要安装 chimee
npm i chimee
# 安装截图插件
npm i chimee-plugin-snapshot
```

```javascript
import ChimeePluginSnapshot from 'chimee-plugin-snapshot'
import ChimeePlayer from 'chimee-player'

ChimeePlayer.install(ChimeePluginSnapshot)

const player = new ChimeePlayer({
  plugin: [{
    name: ChimeePluginSnapshot.name,
    watermark: {
      text: "chimee",
      // image: "example.png",
      x: 100,
      y: 100,
      repeat: true,
      rotate: 30
    },
    onSnapshotted(snapshot) {
      // do
    }
  }]
})
```

## Config

### `watermark`

水印功能默认是关闭的，如果要开启，必须配置 `watermark` 参数，而且至少要配置其中的 `text` 或 `image` 参数（非空字符串）

+ `text` 水印字符
+ `image` 水印图片，不能和 `text` 共用，否则只按照 `text` 设置水印而忽略 `image` 参数
+ `x` 开始位置横坐标（左上角为原点，向右为正方向，单位 px），默认 `-10` 即距离右边 10px
+ `y` 开始位置纵坐标（左上角为原点，向下为正方向，单位 px），默认 `-10` 即距离下边 10px
+ `rotate` 旋转角度（正为顺时针，反之逆时针），默认 `0` 即不旋转
+ `fontSize` 字体大小，默认值 `24`，**只对 `text` 水印有效**
+ `fontFamily` 字体名称，默认值 `"sans-serif"`，**只对 `text` 水印有效**
+ `fontColor` 字体颜色，支持 RGB、RGBA、HLS、十六进制数值等格式，默认值 `"#rgba(0, 0, 0, 0.5)"`，**只对 `text` 水印有效**
+ `opacity` 透明度，0 为全透明，1 为不透明，默认 `0.5`，**只对 `image` 水印有效**

### `onSnapshotted(snapshot)`

本插件只提供生成截图功能，至于截图生成之后如何使用，完全由开发者自己决定

这个参数表示截图完成的回调函数，开发者可以在这里完成使用截图的逻辑

回调函数的参数 snapshot 表示生成截图的对象，其中的属性包括：

+ `blob` 截图的 Blob 对象，方便开发者实现上传图片等逻辑
+ `src` 截图的 URL ，其实就是通过 `URL.createObjectURL(blob)` 生成的，方便开发者实现展示图片等逻辑
+ `width` 截图的宽（px）
+ `height` 截图的高（px）

## examples

+ [看线上 Demo](https://zcoding.github.io/chimee-plugin-snapshot/)
+ [看代码](examples/simple)
