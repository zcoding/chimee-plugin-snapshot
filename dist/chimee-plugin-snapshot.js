var ChimeeSnapshot = (function () {
'use strict';

function Warn() {
  console.warn.apply(console, [].concat(Array.prototype.slice.call(arguments)));
}

var Snapshot = {
  name: "Snapshot",
  beforeCreate: function beforeCreate() {
    this.$canvas = document.createElement('canvas');
  },

  methods: {
    takeSnapshot: function takeSnapshot() {
      var snapshotWidth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.width;

      var _this = this;

      var snapshotHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.height;
      var quality = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.8;

      var cvs = this.$canvas;
      cvs.width = snapshotWidth;
      cvs.height = snapshotHeight;
      var ctx = cvs.getContext('2d');
      this.$video.crossOrigin = "Anonymous";
      ctx.drawImage(this.$video, 0, 0, snapshotWidth, snapshotHeight);
      if (this.$config.watermark) {
        var watermarkConfig = this.$config.watermark;
        // draw watermark
        if (watermarkConfig.text) {
          ctx.save();
          var rotate = watermarkConfig.rotate || 0;
          ctx.rotate(rotate / 180 * Math.PI);
          var wmX = watermarkConfig.x || -10;
          wmX = wmX < 0 ? snapshotWidth + wmX : wmX;
          var wmY = watermarkConfig.y || -10;
          wmY = wmY < 0 ? snapshotWidth + wmY : wmY;
          var wmFZ = watermarkConfig.fontSize || 24;
          var wmFF = watermarkConfig.fontFamily || 'sans-serif';
          ctx.fillStyle = watermarkConfig.fontColor || '#333';
          ctx.font = wmFZ + 'px ' + wmFF;
          ctx.fillText(watermarkConfig.text, wmX, wmY);
          ctx.restore();
        } else if (watermarkConfig.image) {} else {
          Warn('添加截图水印至少要配置 text 或 image 参数');
        }
      }
      cvs.toBlob(function (blob) {
        if (_this.$config.snapshotted) {
          _this.$config.snapshotted.call(null, {
            blob: blob,
            src: URL.createObjectURL(blob),
            currentTime: _this.currentTime
          });
        }
      }, 'image/jpeg', quality);
    }
  }
};

return Snapshot;

}());
