ChimeePlayer.install(ChimeeSnapshot)

const snapshotContainer = document.querySelector('.snapshot-container')

var player = new ChimeePlayer({
  wrapper: '.chimee-container',
  src: './1.mp4',
  isLive: false,
  box:'native',
  autoplay: false,
  controls: true,
  autoplay: true,
  width: 640,
  height: 360,
  plugin: [{
    name: ChimeeSnapshot.name,
    // watermark: {
    //   text: 'chimee-plugin-snapshot',
    //   x: -300,
    //   y: -100,
    //   rotate: 15,
    //   fontColor: 'rgba(255, 255, 255, 0.5)',
    //   fontSize: 22
    // },
    watermark: {
      image: './chimee-logo.png',
      x: -140,
      y: -70,
      opacity: 0.8,
      rotate: 10
    },
    snapshotted(snapshot) {
      const image = new Image()
      image.src = snapshot.src
      snapshotContainer.appendChild(image)
      console.log(snapshot)
    }
  }]
})

let count = 0
const timer = setInterval(() => {
  if (count >= 10) {
    clearTimeout(timer)
    return false
  }
  player.$plugins.snapshot.takeSnapshot()
  count++
}, 1000)
