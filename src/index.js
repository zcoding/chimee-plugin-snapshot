function Warn() {
  console.warn.apply(console, [...arguments])
}

const Snapshot = {
  name: "Snapshot",
  beforeCreate(config) {
    this.$canvas = document.createElement('canvas')
  },
  create() {
    if (this.$config.watermark && this.$config.watermark.image) {
      const image = new Image()
      this._onImageReady = new Promise((resolve, reject) => {
        image.onload = function() {
          resolve(image)
        }
        image.onerror = function(err) {
          reject(err)
        }
      })
      image.src = this.$config.watermark.image
    }
  },
  methods: {
    createBlob(quality) {
      this.$canvas.toBlob(blob => {
        if (this.$config.snapshotted) {
          this.$config.snapshotted.call(null, {
            blob,
            src: URL.createObjectURL(blob),
            currentTime: this.currentTime
          })
        }
      }, 'image/jpeg', quality)
    },
    takeSnapshot(snapshotWidth = this.width, snapshotHeight = this.height, quality = 0.8) {
      const cvs = this.$canvas
      cvs.width = snapshotWidth
      cvs.height = snapshotHeight
      const ctx = cvs.getContext('2d')
      ctx.drawImage(this.$video, 0, 0, snapshotWidth, snapshotHeight)
      if (this.$config.watermark) {
        const watermarkConfig = this.$config.watermark
        let wmX = watermarkConfig.x || -10
        wmX = wmX < 0 ? (snapshotWidth + wmX) : wmX
        let wmY = watermarkConfig.y || -10
        wmY = wmY < 0 ? (snapshotHeight + wmY) : wmY
        if (watermarkConfig.text) {
          ctx.save()
          const rotate = watermarkConfig.rotate || 0
          ctx.rotate(rotate * Math.PI / 180)
          const wmFZ = watermarkConfig.fontSize || 24
          const wmFF = watermarkConfig.fontFamily || 'sans-serif'
          ctx.fillStyle = watermarkConfig.fontColor || 'rgba(0, 0, 0, 0.5)'
          ctx.font = `${wmFZ}px ${wmFF}`
          ctx.fillText(watermarkConfig.text, wmX, wmY)
          ctx.restore()
          this.createBlob(quality)
        } else if (watermarkConfig.image) {
          ctx.save()
          ctx.globalAlpha = watermarkConfig.opacity || 0.5
          this._onImageReady.then(image => {
            ctx.drawImage(image, wmX, wmY, image.width, image.height)
            ctx.restore()
            this.createBlob(quality)
          }).catch(error => {
            console.error('无法加载水印图片')
            ctx.restore()
            this.createBlob(quality)
          })
        } else {
          Warn('添加截图水印至少要配置 text 或 image 参数')
        }
      } else {
        this.createBlob(quality)
      }
    }
  }
}

export default Snapshot
