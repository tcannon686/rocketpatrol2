/**
 * Rocket player prefab
 */
class Rocket extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame)

    scene.add.existing(this)
    this.sfxRocket = scene.sound.add('sfx_rocket')
    this.isFiring = false
    this.moveSpeed = 2 * 60 / 1000
  }

  moveToX (x) {
    this.targetX = x
  }

  fire () {
    if (!this.isFiring) {
      this.isFiring = true
      this.sfxRocket.play()
    }
  }

  update (t, dt) {
    /* Left and right movement. */
    if (!this.isFiring) {
      if (keyLeft.isDown && this.x >= borderUISize + this.width) {
        this.x -= this.moveSpeed * dt

        /* Stop moving to the specified position. */
        this.targetX = null
      }

      if (
        keyRight.isDown &&
        this.x <= game.config.width - borderUISize - this.width
      ) {
        this.x += this.moveSpeed * dt

        /* Stop moving to the specified position. */
        this.targetX = null
      }

      /* Move to specified position. */
      if (this.targetX != null) {
        const amount = this.moveSpeed * dt
        this.x += (
           Math.min(Math.max(this.targetX - this.x, -amount), amount)
        )
      }
    }

    /* Firing. */
    if (Phaser.Input.Keyboard.JustDown(keyF)) {
      this.fire()
    }

    if (this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
      this.y -= this.moveSpeed * dt
    }

    /* Reset on miss. */
    if (this.y <= borderUISize * 3 + borderPadding) {
      this.reset()
    }
  }

  reset () {
    this.y = game.config.height - borderUISize - borderPadding
    this.isFiring = false
  }
}
