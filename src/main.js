/*
 *
 * Name: Thomas Cannon
 * Project Title: Rocket Patrol 2
 * Date: 4/21/2020
 * How long it took: About 12 hours (it took a long time to make art and make
 * things look good and go through the Phaser documentation)
 *
 * Point breakdown:
 *  - Added new menu (+20)
 *  - Added new assets (+20)
 *  - Added mouse controls (+20)
 *  - Added explosion particle (+20)
 *  - Added 4 explode sfx (+10)
 *  - Added timer (+10)
 *  - Added parallax (+10 points)
 *  - Added animated sprites for the spaceships (they are now asteroids) (+10)
 *  - Added music (+5)
 */
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

/* Remove context menu. */
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})
