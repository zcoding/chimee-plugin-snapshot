var ChimeeSnapshot = (function () {
'use strict';

function Warn() {
  console.warn.apply(console, [].concat(Array.prototype.slice.call(arguments)));
}

var Snapshot = {
  name: "Snapshot",
  beforeCreate: function beforeCreate(config) {
    this.$canvas = document.createElement('canvas');
  },
  create: function create() {
    if (this.$config.watermark && this.$config.watermark.image) {
      var image = new Image();
      this._onImageReady = new Promise(function (resolve, reject) {
        image.onload = function () {
          resolve(image);
        };
        image.onerror = function (err) {
          reject(err);
        };
      });
      image.src = this.$config.watermark.image;
    }
  },

  methods: {
    createBlob: function createBlob(quality) {
      var _this = this;

      this.$canvas.toBlob(function (blob) {
        if (_this.$config.snapshotted) {
          _this.$config.snapshotted.call(null, {
            blob: blob,
            src: URL.createObjectURL(blob),
            currentTime: _this.currentTime
          });
        }
      }, 'image/jpeg', quality);
    },
    takeSnapshot: function takeSnapshot() {
      var snapshotWidth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.width;

      var _this2 = this;

      var snapshotHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.height;
      var quality = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.8;

      var cvs = this.$canvas;
      cvs.width = snapshotWidth;
      cvs.height = snapshotHeight;
      var ctx = cvs.getContext('2d');
      ctx.drawImage(this.$video, 0, 0, snapshotWidth, snapshotHeight);
      if (this.$config.watermark) {
        var watermarkConfig = this.$config.watermark;
        var wmX = watermarkConfig.x || -10;
        wmX = wmX < 0 ? snapshotWidth + wmX : wmX;
        var wmY = watermarkConfig.y || -10;
        wmY = wmY < 0 ? snapshotHeight + wmY : wmY;
        ctx.save();
        var rotate = watermarkConfig.rotate || 0;
        ctx.translate(wmX, wmY);
        ctx.rotate(rotate * Math.PI / 180);
        if (watermarkConfig.text) {
          var wmFZ = watermarkConfig.fontSize || 24;
          var wmFF = watermarkConfig.fontFamily || 'sans-serif';
          ctx.fillStyle = watermarkConfig.fontColor || 'rgba(0, 0, 0, 0.5)';
          ctx.font = wmFZ + 'px ' + wmFF;
          ctx.fillText(watermarkConfig.text, 0, 0);
          ctx.restore();
          this.createBlob(quality);
        } else if (watermarkConfig.image) {
          ctx.globalAlpha = watermarkConfig.opacity || 0.5;
          this._onImageReady.then(function (image) {
            ctx.drawImage(image, 0, 0, image.width, image.height);
            ctx.restore();
            _this2.createBlob(quality);
          }).catch(function (error) {
            console.error('无法加载水印图片');
            ctx.restore();
            _this2.createBlob(quality);
          });
        } else {
          ctx.restore();
          Warn('添加水印至少要配置 text 或 image 参数');
        }
      } else {
        this.createBlob(quality);
      }
    }
  }
};

return Snapshot;

}());
