class Spaceship extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, texture, frame, pointValue) {
    super (scene, x, y, texture, frame)

    this.points = pointValue
    this.moveSpeed = game.settings.spaceshipSpeed
    scene.add.existing(this)
  }

  update (t, dt) {
    /* Move spaceship left. */
    this.x -= this.moveSpeed * dt

    /* Wrap around from left to right edge. */
    if (this.x <= 0 - this.width) {
      this.reset()
    }
  }

  reset () {
    this.x = game.config.width
  }
}
