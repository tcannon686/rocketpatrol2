/**
 * Rocket player prefab
 */
class Rocket extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, texture, frame) {
    super (scene, x, y, texture, frame)

    scene.add.existing(this)
    this.isFiring = false
    this.moveSpeed = 0.12
  }

  update (t, dt) {
    /* Left and right movement. */
    if (!this.isFiring) {
      if (keyLeft.isDown && this.x >= borderUISize + this.width) {
        this.x -= this.moveSpeed * dt
      }

      if (
        keyRight.isDown &&
        this.x <= game.config.width - borderUISize - this.width
      ) {
        this.x += this.moveSpeed * dt
      }
    }
  }
}
