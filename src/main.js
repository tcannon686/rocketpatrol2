const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  scene: [Menu, Play],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
})

const borderUISize = game.config.height / 16
const borderPadding = borderUISize / 3
const starSpeed = 0.1

/* Reserve keyboard bindings. */
let keyF, keyLeft, keyRight, keyR
