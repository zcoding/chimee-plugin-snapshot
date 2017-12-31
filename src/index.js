function Warn() {
  console.warn.apply(console, [...arguments])
}

const Snapshot = {
  name: "Snapshot",
  beforeCreate() {
    this.$canvas = document.createElement('canvas')
  },
  methods: {
    takeSnapshot(snapshotWidth = this.width, snapshotHeight = this.height, quality = 0.8) {
      const cvs = this.$canvas
      cvs.width = snapshotWidth
      cvs.height = snapshotHeight
      const ctx = cvs.getContext('2d')
      this.$video.crossOrigin = "Anonymous"
      ctx.drawImage(this.$video, 0, 0, snapshotWidth, snapshotHeight)
      if (this.$config.watermark) {
        const watermarkConfig = this.$config.watermark
        // draw watermark
        if (watermarkConfig.text) {
          ctx.save()
          const rotate = watermarkConfig.rotate || 0
          ctx.rotate((rotate / 180) * Math.PI)
          let wmX = watermarkConfig.x || -10
          wmX = wmX < 0 ? snapshotWidth + wmX : wmX
          let wmY = watermarkConfig.y || -10
          wmY = wmY < 0 ? snapshotWidth + wmY : wmY
          const wmFZ = watermarkConfig.fontSize || 24
          const wmFF = watermarkConfig.fontFamily || 'sans-serif'
          ctx.fillStyle = watermarkConfig.fontColor || '#333'
          ctx.font = `${wmFZ}px ${wmFF}`
          ctx.fillText(watermarkConfig.text, wmX, wmY)
          ctx.restore()
        } else if (watermarkConfig.image) {
        } else {
          Warn('添加截图水印至少要配置 text 或 image 参数')
        }
      }
      cvs.toBlob(blob => {
        if (this.$config.snapshotted) {
          this.$config.snapshotted.call(null, {
            blob,
            src: URL.createObjectURL(blob),
            currentTime: this.currentTime
          })
        }
      }, 'image/jpeg', quality)
    }
  }
}

export default Snapshot
