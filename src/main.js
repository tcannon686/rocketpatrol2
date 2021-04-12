const game = new Phaser.Game({
  type: Phaser.CANVAS,
  width: 640,
  height: 480,
  scene: [ Play, Menu ]
})

const borderUISize = game.config.height / 16
const borderPadding = borderUISize / 3
const starSpeed = 0.1

/* Reserve keyboard bindings. */
let keyF, keyLeft, keyRight, keyR
