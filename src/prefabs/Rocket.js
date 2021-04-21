/**
 * Rocket player prefab
 */
class Rocket extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame)

    this.sfxRocket = scene.sound.add('sfx_rocket')
    this.isFiring = false
    this.moveSpeed = 2 * 60 / 1000

    /* Particles. */
    this.explodeParticles = scene.add.particles('soft')
    const config = {
      tint: 0xff1100,
      lifespan: 250,
      maxParticles: 1000,
      frequency: 0,
      radial: true,
      angle: { min: 70, max: 110 },
      blendMode: Phaser.BlendModes.ADD,
      alpha: { start: 1, end: 0 },
      scale: { min: 0.25, max: 0.5, end: 1.0 },
      speed: { min: 128, max: 256 },
      follow: this,
      followOffset: { x: 0, y: 32 }
    }
    this.explodeParticles.createEmitter(config)
    scene.add.existing(this)
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
    this.y = game.config.height - borderUISize - borderPadding - 24
    this.isFiring = false
  }
}
