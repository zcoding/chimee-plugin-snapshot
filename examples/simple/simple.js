ChimeePlayer.install(ChimeeSnapshot)

var player = new ChimeePlayer({
  wrapper: '.chimee-container',
  src: './1.mp4',
  isLive: false,
  box:'native',
  autoplay: false,
  controls: true,
  plugin: [{
    name: ChimeeSnapshot.name,
    snapshotted(snapshot) {
      const image = new Image()
      image.src = snapshot.src
      image.style.position = 'absolute'
      image.style.width = '300px'
      image.style.top = '0'
      image.style.right = '0'
      image.style.zIndex = 1000
      document.body.appendChild(image)
      console.log(snapshot)
    }
  }]
})

setTimeout(() => {
  player.$plugins.snapshot.takeSnapshot(640, 360)
}, 3000)
